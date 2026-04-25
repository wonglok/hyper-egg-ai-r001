import { app } from 'electron'
import fs from 'fs'
import path from 'path'
export const AppDataPath = app.getPath('appData')
export const WorkSpacesPath = `${AppDataPath}/ai-home/workspaces/`

// export function getDirectoriesSync(dirPath) {
//   return fs.readdirSync(dirPath).filter(function (file) {
//     // Check if the item is a directory
//     return fs.statSync(path.join(dirPath, file)).isDirectory()
//   })
// }
