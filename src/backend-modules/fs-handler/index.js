import fsProm from "fs/promises"
import fs from "fs"

export async function exsistPath(p = '') {
    return fsProm.access(p, fs.constants.F_OK).then(() => true).catch(() => false)
}
