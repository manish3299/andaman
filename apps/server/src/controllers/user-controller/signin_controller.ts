import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@winterfell/database';
import { github_services } from '../../services/init';
import env from '../../configs/config.env';
import { verifyTurnstileToken } from './signInController';

export default async function signInController(req: Request, res: Response) {
    const { user, account, turnstileToken, linkingUserId } = req.body;
    console.log('req body is : ', req.body);
    if (!user.email) {
        ResponseWriter.unauthorized(res);
        return;
    }

    if (!account?.provider) {
        ResponseWriter.unauthorized(res, 'Provider is required');
        return;
    }

    if (!env.SERVER_JWT_SECRET) {
        ResponseWriter.server_error(res, 'Server configuration error');
        return;
    }

    const clientIp =
        req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    let finalUser;

    try {
        if (account.provider === 'github') {
            const github_username = await github_services.get_github_owner(account.access_token);
            console.log('github owner username is : ', github_username);
            if (linkingUserId) {
                console.log('Linking GitHub to existing user:', linkingUserId);
                const existingUser = await prisma.user.findUnique({
                    where: { id: linkingUserId },
                });
                console.log('first existingUser is : ', existingUser);
                if (!existingUser) {
                    ResponseWriter.not_found(res, 'User to link not found');
                    return;
                }

                const userWithGithubId = await prisma.user.findUnique({
                    where: { githubId: account.providerAccountId },
                });
                console.log('userWithGithubId is : ', userWithGithubId);
                if (userWithGithubId && userWithGithubId.id !== linkingUserId) {
                    ResponseWriter.unauthorized(res);
                    return;
                }

                finalUser = await prisma.user.update({
                    where: { id: linkingUserId },
                    data: {
                        githubId: account.providerAccountId,
                        githubUsername: github_username,
                        githubAccessToken: account.access_token,
                        provider: existingUser.provider
                            ? existingUser.provider.includes('github')
                                ? existingUser.provider
                                : `${existingUser.provider},github`
                            : 'github',
                    },
                });
                console.log('finalUser after linking is : ', finalUser);
            } else {
                // Regular GitHub sign-in
                // First check by githubId
                let existingUser = await prisma.user.findUnique({
                    where: { githubId: account.providerAccountId },
                });
                console.log('existingUser by githubId is : ', existingUser);

                // Then check by email if not found
                if (!existingUser) {
                    existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });
                }

                if (!existingUser) {
                    // New user - verify turnstile
                    const isValid = await verifyTurnstileToken(turnstileToken, clientIp);
                    console.log('Turnstile validation result is : ', isValid);
                    if (!isValid) {
                        ResponseWriter.unauthorized(res, 'Turnstile verification failed');
                        return;
                    }

                    finalUser = await prisma.user.create({
                        data: {
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            provider: 'github',
                            githubAccessToken: account.access_token,
                            githubId: account.providerAccountId,
                            githubUsername: github_username,
                        },
                    });
                    console.log('finalUser after creation is : ', finalUser);
                } else {
                    // Existing user - update GitHub info
                    finalUser = await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            githubAccessToken: account.access_token,
                            githubId: account.providerAccountId,
                            githubUsername: github_username,
                            provider: existingUser.provider
                                ? existingUser.provider.includes('github')
                                    ? existingUser.provider
                                    : `${existingUser.provider},github`
                                : 'github',
                        },
                    });
                }
            }
        } else if (account.provider === 'google') {
            console.log('Processing Google sign-in');
            // Google sign-in
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });
            console.log('existingUser for google is : ', existingUser);

            if (!existingUser) {
                // New user - verify turnstile
                const isValid = await verifyTurnstileToken(turnstileToken, clientIp);
                console.log('Turnstile validation result is : ', isValid);
                if (!isValid) {
                    ResponseWriter.unauthorized(res, 'Turnstile verification failed');
                    return;
                }

                finalUser = await prisma.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: 'google',
                    },
                });
                console.log('finalUser after google creation is : ', finalUser);
            } else {
                finalUser = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        name: user.name || existingUser.name,
                        image: user.image || existingUser.image,
                        provider: existingUser.provider
                            ? existingUser.provider.includes('google')
                                ? existingUser.provider
                                : `${existingUser.provider},google`
                            : 'google',
                    },
                });
                console.log('finalUser after google update is : ', finalUser);
            }
        } else {
            ResponseWriter.unauthorized(res, 'Unsupported provider');
            return;
        }
        console.log('--------------------------------> finalUser is : ', finalUser);
        if (!finalUser) {
            ResponseWriter.server_error(res, 'Failed to process user');
            return;
        }

        const jwtPayload = {
            id: finalUser.id,
            email: finalUser.email,
            name: finalUser.name,
        };
        console.log('jwtPayload is : ', jwtPayload);

        const token = jwt.sign(jwtPayload, env.SERVER_JWT_SECRET, { expiresIn: '30d' });
        console.log('token is : ', token);
        return res.json({
            success: true,
            user: {
                id: finalUser.id,
                name: finalUser.name,
                email: finalUser.email,
                image: finalUser.image,
                provider: finalUser.provider,
                hasGithub: !!finalUser.githubAccessToken,
                githubUsername: finalUser.githubUsername,
            },
            token,
        });
    } catch (err) {
        console.error('Error in signInController: ', err);
        ResponseWriter.server_error(
            res,
            'Failed to signin',
            err instanceof Error ? err.message : undefined,
        );
        return;
    }
}
