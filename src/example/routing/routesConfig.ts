import * as multer from 'multer';
import { Repository } from '../../../node_modules/typeorm/repository/Repository';
import { Team } from '../../entity/Team';
import { User } from '../../entity/User';
import '../typeorm';

const upload = multer({ dest: 'uploads/' });
import { ISerializer } from '../../../packages/hadron-serialization';

const func = () => 'Hello world';

const alterFunc = (testParam: any) => testParam;

const uploadFile = (req: any) => req;

const uploadMiddleware = upload.any();

const hello = () => 'Hello World!';
class UserDto {
  constructor(public id: number, public name: string, public teamName: string) { }
}
// tslint:disable-next-line:max-classes-per-file
class TeamDto {
  constructor(public id: number, public name: string, public amount: number) { }
}

const getAllUsers = async(userRepository: Repository<User>) =>
  await userRepository.find({relations : ['team']})
    .then(users => users.map(user => new UserDto(user.id, user.name, user.team.name)));

const getUserById = async(userRepository: Repository<User>, id: number) => await userRepository.findOneById(id);
const getAllTeams = async(teamRepository: Repository<Team>) =>
  await teamRepository.find({relations : ['users']})
    .then(teams => teams.map(team => new TeamDto(team.id, team.name, team.users.length)));

const getTeamById = async(teamRepository: Repository<Team>, id: number) => await teamRepository.findOneById(id);

const insertUser = async(userRepository: Repository<User>,
                          teamRepository: Repository<Team>,
                          userName: string, teamId: number) => {
  const t = await teamRepository.findOneById(teamId);
  await userRepository.insert({name: userName, team: t });
  return `total amount of users: ${await userRepository.count()}`;
};

const updateUser = async(userRepository: Repository<User>, id: number, userName: string) => {
  const user = await userRepository.findOneById(id);
  const oldName = user.name;
  user.name = userName;
  await userRepository.save(user);
  return `user id: ${id} name: ${oldName} has new name ${userName}`;
};

const updateTeam = async(teamRepository: Repository<Team>, id: number, teamName: string) => {
  const team = await teamRepository.findOneById(id);
  const oldName = team.name;
  team.name = teamName;
  await teamRepository.save(team);
  return `team id: ${id} name: ${oldName} has new name ${teamName}`;
};

const insertTeam = async(teamRepository: Repository<Team>, teamName: string) => {
  await teamRepository.insert({name: teamName});
  return `total amount of teams: ${await teamRepository.count()}`;
};

const first = (req: any, res: any, next: any) => {
  // tslint:disable-next-line:no-console
  console.log('first middleware');
  next();
};

const second = (req: any, res: any, next: any) => {
  // tslint:disable-next-line:no-console
  console.log('second middleware');
  next();
};

const testSerialization = (serializer: ISerializer, type: any, group: any) => {
  const availableResponses = {
    princess: {
      address: 'Górnych Wałów 26/5',
      friends: [
          { name: 'Francesca', salary: '5120', profession: 'Cooker', id: '123' },
          { name: 'Marina', salary: '2010', profession: 'Gardener' },
          { name: 'Robin', salary: '0', profession: 'Crime Fighter' },
      ],
      id: '10002',
      money: '21000',
      name: 'Jasmine',
    },
    unicorn: {
      hornLength: '20',
      id: '10002',
      magicPower: {
        magicSchool: 'Fake',
        name: 'Power of Truth',
        power: '12',
        usability: '0',
      },
      name: 'RainbowHoof',
      price: '2100',
      secretName: 'RainbowFart',
    },
  } as any;
  return serializer.serialize(availableResponses[type], [group], type);
};

export default {
  routeForUploading: {
    callback: uploadFile,
    methods: ['POST'],
    middleware: [uploadMiddleware],
    path: '/upload',
  },
  firstRoute: {
    callback: func,
    methods: ['GET'],
    middleware: [first, second],
    path: '/',
  },
  secondRoute: {
    callback: alterFunc,
    methods: ['GET'],
    path: '/index/:testParam',
  },
  index: {
    callback: hello,
    methods: ['GET'],
    path: '/',
  },
  // tslint:disable-next-line:object-literal-sort-keys
  getAllUsers: {
    callback: getAllUsers,
    methods: ['GET'],
    middleware: [first, second],
    path: '/user/',
  },
  getUserById: {
    callback: getUserById,
    methods: ['GET'],
    path: '/user/:id',
  },
  getTeams: {
    callback: getAllTeams,
    methods: ['GET'],
    path: '/team/',
  },
  getTeamById: {
    callback: getTeamById,
    methods: ['GET'],
    path: '/team/:id',
  },
  insertUser : {
    callback: insertUser,
    methods: ['GET'],
    path: '/insertUser/:userName/:teamId',
  },
  updateUser : {
    callback: updateUser,
    methods: ['GET'],
    path: '/updateUser/:id/:userName',
  },
  insertTeam : {
    callback: insertTeam,
    methods: ['GET'],
    path: '/insertTeam/:teamName',
  },
  updateTeam : {
    callback: updateTeam,
    methods: ['GET'],
    path: '/updateTeam/:id/:teamName',
  },
  thirdRoute: {
    callback: testSerialization,
    methods: ['GET'],
    path: '/serialization/:type/:group',
  },
};
