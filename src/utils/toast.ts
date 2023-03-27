import type { NotificationLocation } from "@prisma/client"
import type { ToastPosition } from "react-hot-toast";

const toastMap : Map<string, ToastPosition> = new Map([
    ['TOPLEFT', 'top-left'],
    ['TOPCENTER', 'top-center'],
    ['TOPRIGHT', 'top-right'],
    ['BOTTOMLEFT', 'bottom-left'],
    ['BOTTOMCENTER', 'bottom-center'],
    ['BOTTOMRIGHT', 'bottom-right']
])

export const allCapsToDash = (allCaps: string) => {
    return toastMap.get(allCaps) as ToastPosition;
}