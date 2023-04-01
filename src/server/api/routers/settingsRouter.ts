import { NotificationLocation, Theme } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { env } from '../../../env.mjs';

const settingsRouter = createTRPCRouter({

    updateSettings: protectedProcedure
        .input(z.object({
            notificationLocation: z.nativeEnum(NotificationLocation),
            theme: z.nativeEnum(Theme),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.settings.upsert({
                where: { userId: ctx.session.user.id },
                update: {
                    notificationLocation: input.notificationLocation ?? 'BOTTOMRIGHT',
                    theme: input.theme ?? 'SYSTEM'
                },
                create: {
                    userId: ctx.session.user.id,
                    notificationLocation: input.notificationLocation ?? 'BOTTOMRIGHT',
                    theme: input.theme ?? 'SYSTEM'
                }
            })
        }),

    getSettings: protectedProcedure
        .query(({ ctx }) => {
            return ctx.prisma.settings.findUnique({
                where: { userId: ctx.session.user.id }
            })
        }),

    getNotificationLocation: protectedProcedure
        .query(async ({ ctx }) => {
            const settings = await ctx.prisma.settings.findUnique({
                where: { userId: ctx.session.user.id },
                select: {
                    notificationLocation: true,
                }
            });

            return settings?.notificationLocation ?? undefined;
        }),

    getTheme: protectedProcedure
        .query(async ({ ctx }) => {
            const settings = await ctx.prisma.settings.findUnique({
                where: { userId: ctx.session.user.id },
                select: {
                    theme: true,
                }
            });

            return settings?.theme ?? undefined;
        }),

    maintainAccount: protectedProcedure
        .input(z.object({
            key: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            if (input.key === env.CRON_KEY) {
                await ctx.prisma.user.update({
                    where: { id: ctx.session.user.id },
                    data: {
                        maintain: true
                    }
                });
            }
        })

});

export default settingsRouter;