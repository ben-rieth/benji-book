import { NotificationLocation, Theme } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

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

});

export default settingsRouter;