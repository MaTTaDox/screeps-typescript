
export const cleanup = () => {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
        }
    }
}
