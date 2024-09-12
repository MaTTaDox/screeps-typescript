import _ from "lodash";

const wantedCreeps = {
  harvester: 3,
  builder: 3,
  upgrader: 2,
  soldier: 2
}

export const spawner = () => {
  //TODO: handle multiple spawns
  const spawn1 = Game.spawns['Spawn1'];

  const availableCreepsByRole = _.groupBy(Game.creeps, 'memory.role');

  const wantedSum = _.sum(_.values(wantedCreeps));
  const existingSum = _.sum(_.values(availableCreepsByRole));

  if (existingSum >= wantedSum) {
    return;
  }

  const role = _.findKey(wantedCreeps, (value, key) => {
    return (availableCreepsByRole[key]?.length || 0) < value;
  });


  if (!role) {
    return;
  }

  const spawn = spawn1;

  const body = buildBody(spawn.room.energyCapacityAvailable);

  spawn.spawnCreep(body, `${role}-${Game.time}`, {
    memory: {role: role, working: false, room: spawn.room.name}
  });
}

const buildBody = (maxEnergy: number) => {
  const body: BodyPartConstant[] = [];
  let energy = 0;

  while (energy + 200 <= maxEnergy) {
    body.push(WORK);
    body.push(CARRY);
    body.push(MOVE);
    energy += 200;
  }

  return body;
}
