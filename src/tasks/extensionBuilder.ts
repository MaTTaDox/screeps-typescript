export const extensionBuilder = () => {
  const controller = Game.spawns['Spawn1'].room.controller!;
  const maximumExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level];
  const existingExtensionsStructures = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_EXTENSION;
    }
  }).length;

  const constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: (site) => {
      return site.structureType == STRUCTURE_EXTENSION;
    }
  }).length;

  const existingExtensions = existingExtensionsStructures + constructionSites;

  if (existingExtensions >= maximumExtensions) {
    return;
  }

  for (let i = 0; i < maximumExtensions - existingExtensions; i++) {
    //check the fields around the spawn for a free spot
    const spawnX = Game.spawns['Spawn1'].pos.x;
    const spawnY = Game.spawns['Spawn1'].pos.y;
    // now in a while
    let freeSpot: LookForAtAreaResultWithPos<"plain" | "swamp" | "wall", "terrain"> | undefined;
    for (let i = 1; i < 10; i++) {
      freeSpot = Game.spawns['Spawn1'].room.lookForAtArea(LOOK_TERRAIN, spawnY - i, spawnX - i, spawnY + i, spawnX + i, true).find((field) => {
        if(field.terrain !== 'plain') {
          return false;
        }
        const constructionSites = Game.spawns['Spawn1'].room.lookForAt(LOOK_CONSTRUCTION_SITES, field.x, field.y);
        if (constructionSites.length > 0) {
          return false;
        }
        const structures = Game.spawns['Spawn1'].room.lookForAt(LOOK_STRUCTURES, field.x, field.y);
        if (structures.length > 0) {
          return false;
        }
        return true;
      });
      if (freeSpot) {
        break;
      }
    }

    if (!freeSpot) {
      console.log('No free spot for extension found');
      return
    }


    console.log('Found free spot for extension at', freeSpot.x, freeSpot.y);
    const result = Game.spawns['Spawn1'].room.createConstructionSite(freeSpot.x, freeSpot.y, STRUCTURE_EXTENSION);
    if (result != OK) {
      console.log('Failed to build extension', result);
    }
  }

}
