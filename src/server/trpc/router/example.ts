import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import haversine from "haversine-distance";

type UserLocationData = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type UserNickname = string;

type LocationsMap = Record<UserNickname, UserLocationData>;

const locations: LocationsMap = {};

export const exampleRouter = router({
  pushPull: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        nickname: z.string(),
      })
    )
    .query(({ input }) => {
      const { latitude, longitude, nickname } = input;

      const timestamp = Date.now();

      locations[nickname] = {
        latitude,
        longitude,
        timestamp,
      };

      const users = Object.entries(locations)
        .filter(([k]) => nickname !== k)
        .map(([n, d]) => ({
          ...d,
          nickname: n,
          distance: haversine(
            { latitude, longitude },
            { latitude: d.latitude, longitude: d.longitude }
          ).toFixed(),
        }))
        .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 0));

      return {
        users,
        timestamp,
      };
    }),
});
