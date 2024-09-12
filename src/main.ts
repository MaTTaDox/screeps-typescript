import {ErrorMapper} from "utils/ErrorMapper";
import {runUpgrader} from "./roles/upgrader";
import {runHarvester} from "./roles/harvester";
import {runBuilder} from "./roles/builder";
import {cleanup} from "./tasks/cleanup";
import {spawner} from "./tasks/spawner";
import {extensionBuilder} from "./tasks/extensionBuilder";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */

  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  cleanup();
  spawner();
  extensionBuilder();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      runHarvester(creep);
    }
    if (creep.memory.role == 'upgrader') {
      runUpgrader(creep);
    }
    if (creep.memory.role == 'builder') {
      runBuilder(creep);
    }
  }
});
