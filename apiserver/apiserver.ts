import {
  ServerRequest,
  createRouter,
  contentTypeFilter,
  createApp,
} from "https://servestjs.org/@v1.1.0/mod.ts";

import { Kakomimasu, Board, Action } from "../Kakomimasu.mjs";

const kkmm = new Kakomimasu();

// #region プレイヤー登録・ルームID取得API

const addPlayer = (playerName: string, spec: string) => {
  const player = kkmm.createPlayer(playerName, spec);

  const freeGame = kkmm.getFreeGames();
  if (freeGame.length == 0) {
    freeGame.push(kkmm.createGame(createDefaultBoard()));
  }
  freeGame[0].attachPlayer(player);

  return player;
};

export class PlayerPost {
  constructor(public name: string, public spec: string) {}
}

export const newPlayerPost = async (req: ServerRequest) => {
  console.log(req, "newPlayer");
  const playerPost = (await req.json()) as PlayerPost;
  const player = addPlayer(playerPost.name, playerPost.spec);
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify(player.getJSON()),
  });
};

// #endregion

export const getGameInfo = async (req: ServerRequest) => {
  console.log(req, "GameInfo");
  /*const bodyJson = (await req.json()) as PlayerPost;
  const player = new Player(bodyJson.playerName, bodyJson.spec);
  players.push(player);
  */
  await req.respond({
    status: 200,
    /*headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify(player),*/
  });
};

// Setting routes
export const routes = () => {
  const router = createRouter();

  router.handle("match", contentTypeFilter("application/json"), newPlayerPost);

  router.get(new RegExp("^match/(.\\d+?)$"), getGameInfo);

  return router;
};

// Port Listen
const app = createApp();
app.route("/", routes());
app.listen({ port: 8880 });

const createDefaultBoard = () => {
  const w = 8;
  const h = 8;
  const points = [];
  for (let i = 0; i < w * h; i++) {
    points[i] = i;
    // points[i] = i % (16 * 2 + 1) - 16;
    // util.rnd(16 * 2 + 1) - 16;
  }
  const nagent = 6;
  return new Board(w, h, points, nagent);
};
