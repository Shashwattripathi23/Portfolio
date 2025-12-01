import { setMaxIdleHTTPParsers } from "http";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

export default function HooligangVisualizer({
  musicOn,
  setMusicOn,
}: {
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
}) {
  // --- Data: Hooligang Lyrics and Timings (Estimated Full Sync, 5-Line Chorus Fixed) ---
  type WordTiming = {
    time: number;
    word: string;
    style: "normal" | "glitch" | "bold";
    font: number;
  };

  const LYRICS: WordTiming[] = [
    // --- [00:00.29] Yo, you wanna see something cool? ---
    { time: 290, word: "YO,", style: "normal", font: 0 },
    { time: 565, word: "YOU", style: "normal", font: 1 },
    { time: 840, word: "WANNA", style: "normal", font: 2 },
    { time: 1115, word: "SEE", style: "normal", font: 3 },
    { time: 1390, word: "SOMETHING", style: "normal", font: 0 },
    { time: 1665, word: "COOL?", style: "glitch", font: 1 },

    // --- [00:01.94] No? Well I'ma do it anyway ---
    { time: 1940, word: "NO?", style: "normal", font: 2 },
    { time: 2251, word: "WELL", style: "normal", font: 3 },
    { time: 2562, word: "I'MA", style: "normal", font: 0 },
    { time: 2873, word: "DO", style: "normal", font: 1 },
    { time: 3184, word: "IT", style: "normal", font: 2 },
    { time: 3495, word: "ANYWAY", style: "normal", font: 3 },

    // --- [00:03.81] Runnin' and runnin' sequence 1 ---
    { time: 3810, word: "RUNNIN'", style: "glitch", font: 0 },
    { time: 4042, word: "AND", style: "normal", font: 1 },
    { time: 4274, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 4506, word: "AND", style: "normal", font: 3 },
    { time: 4738, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 4970, word: "AND", style: "normal", font: 1 },
    { time: 5202, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 5434, word: "AND", style: "normal", font: 3 },
    { time: 5666, word: "RUNNIN',", style: "normal", font: 0 },
    { time: 5898, word: "RUN—", style: "glitch", font: 1 },

    // --- [00:06.37] Runnin' and runnin' sequence 2 ---
    { time: 6370, word: "RUNNIN'", style: "glitch", font: 2 },
    { time: 6600, word: "AND", style: "normal", font: 3 },
    { time: 6830, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 7060, word: "AND", style: "normal", font: 1 },
    { time: 7290, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 7520, word: "AND", style: "normal", font: 3 },
    { time: 7750, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 7980, word: "AND", style: "normal", font: 1 },
    { time: 8210, word: "RUNNIN'", style: "normal", font: 2 },

    // --- [00:08.91] Runnin' and runnin' sequence 3 ---
    { time: 8910, word: "RUNNIN'", style: "glitch", font: 3 },
    { time: 9137, word: "AND", style: "normal", font: 0 },
    { time: 9364, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 9591, word: "AND", style: "normal", font: 2 },
    { time: 9818, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 10045, word: "AND", style: "normal", font: 0 },
    { time: 10272, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 10499, word: "AND", style: "normal", font: 2 },
    { time: 10726, word: "RUNNIN',", style: "normal", font: 3 },
    { time: 10953, word: "RUN—", style: "glitch", font: 0 },

    // --- [00:11.41] Runnin' and runnin' sequence 4 ---
    { time: 11410, word: "RUNNIN'", style: "glitch", font: 1 },
    { time: 11627, word: "AND", style: "normal", font: 2 },
    { time: 11844, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 12061, word: "AND", style: "normal", font: 0 },
    { time: 12278, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 12495, word: "AND", style: "normal", font: 2 },
    { time: 12712, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 12929, word: "AND—", style: "glitch", font: 0 },

    // --- [00:13.15] Step into the scene ---
    { time: 13150, word: "STEP", style: "normal", font: 1 },
    { time: 13577, word: "INTO", style: "normal", font: 2 },
    { time: 14004, word: "THE", style: "normal", font: 3 },
    { time: 14431, word: "SCENE", style: "normal", font: 0 },

    // --- [00:14.86] No, nobody can do it like me ---
    { time: 14860, word: "NO,", style: "normal", font: 1 },
    { time: 15167, word: "NOBODY", style: "normal", font: 2 },
    { time: 15474, word: "CAN", style: "normal", font: 3 },
    { time: 15781, word: "DO", style: "normal", font: 0 },
    { time: 16088, word: "IT", style: "normal", font: 1 },
    { time: 16395, word: "LIKE", style: "normal", font: 2 },
    { time: 16702, word: "ME", style: "glitch", font: 3 },

    // --- [00:17.01] Zoo Pals plate with the Kid Cuisine ---
    { time: 17010, word: "ZOO", style: "normal", font: 0 },
    { time: 17405, word: "PALS", style: "normal", font: 1 },
    { time: 17800, word: "PLATE", style: "normal", font: 2 },
    { time: 18195, word: "WITH", style: "normal", font: 3 },
    { time: 18590, word: "THE", style: "normal", font: 0 },
    { time: 18985, word: "KID", style: "normal", font: 1 },
    { time: 19380, word: "CUISINE", style: "normal", font: 2 },

    // --- [00:19.78] I was the blacktop king ---
    { time: 19780, word: "I", style: "normal", font: 3 },
    { time: 20120, word: "WAS", style: "normal", font: 0 },
    { time: 20460, word: "THE", style: "normal", font: 1 },
    { time: 20800, word: "BLACKTOP", style: "normal", font: 2 },
    { time: 21140, word: "KING", style: "glitch", font: 3 },

    // --- [00:21.48] 360s in my green machine ---
    { time: 21480, word: "360S", style: "glitch", font: 0 },
    { time: 22022, word: "IN", style: "normal", font: 1 },
    { time: 22564, word: "MY", style: "normal", font: 2 },
    { time: 23106, word: "GREEN", style: "normal", font: 3 },
    { time: 23648, word: "MACHINE", style: "normal", font: 0 },

    // --- [00:24.19] I was a kid and I was breaking down doors ---
    { time: 24190, word: "I", style: "normal", font: 1 },
    { time: 24424, word: "WAS", style: "normal", font: 2 },
    { time: 24658, word: "A", style: "normal", font: 3 },
    { time: 24892, word: "KID", style: "normal", font: 0 },
    { time: 25126, word: "AND", style: "normal", font: 1 },
    { time: 25360, word: "I", style: "normal", font: 2 },
    { time: 25594, word: "WAS", style: "normal", font: 3 },
    { time: 25828, word: "BREAKING", style: "glitch", font: 0 },
    { time: 26062, word: "DOWN", style: "normal", font: 1 },
    { time: 26296, word: "DOORS", style: "normal", font: 2 },

    // --- [00:26.53] Listening to Tribe, now we on a world tour ---
    { time: 26530, word: "LISTENING", style: "normal", font: 3 },
    { time: 26837, word: "TO", style: "normal", font: 0 },
    { time: 27144, word: "TRIBE,", style: "normal", font: 1 },
    { time: 27451, word: "NOW", style: "normal", font: 2 },
    { time: 27758, word: "WE", style: "normal", font: 3 },
    { time: 28065, word: "ON", style: "normal", font: 0 },
    { time: 28372, word: "A", style: "normal", font: 1 },
    { time: 28679, word: "WORLD", style: "normal", font: 2 },
    { time: 28986, word: "TOUR", style: "glitch", font: 3 },

    // --- [00:29.30] We gave 'em Hell and now we gonna give 'em more ---
    { time: 29300, word: "WE", style: "normal", font: 0 },
    { time: 29527, word: "GAVE", style: "normal", font: 1 },
    { time: 29754, word: "'EM", style: "normal", font: 2 },
    { time: 29981, word: "HELL", style: "glitch", font: 3 },
    { time: 30208, word: "AND", style: "normal", font: 0 },
    { time: 30435, word: "NOW", style: "normal", font: 1 },
    { time: 30662, word: "WE", style: "normal", font: 2 },
    { time: 30889, word: "GONNA", style: "normal", font: 3 },
    { time: 31116, word: "GIVE", style: "normal", font: 0 },
    { time: 31343, word: "'EM", style: "normal", font: 1 },
    { time: 31570, word: "MORE", style: "glitch", font: 2 },

    // --- [00:31.57] JVB mighty morphin' like Megazord ---
    { time: 31570, word: "JVB", style: "normal", font: 3 },
    { time: 32095, word: "MIGHTY", style: "normal", font: 0 },
    { time: 32620, word: "MORPHIN'", style: "normal", font: 1 },
    { time: 33145, word: "LIKE", style: "normal", font: 2 },
    { time: 33670, word: "MEGAZORD", style: "glitch", font: 3 },

    // --- [00:34.71] Yo, power like Ranger, range like Rover ---
    { time: 34710, word: "YO,", style: "normal", font: 0 },
    { time: 35112, word: "POWER", style: "normal", font: 1 },
    { time: 35514, word: "LIKE", style: "normal", font: 2 },
    { time: 35916, word: "RANGER,", style: "normal", font: 3 },
    { time: 36318, word: "RANGE", style: "normal", font: 0 },
    { time: 36720, word: "LIKE", style: "normal", font: 1 },
    { time: 37122, word: "ROVER", style: "normal", font: 2 },

    // --- [00:37.93] Strong bulldozer ---
    { time: 37930, word: "STRONG", style: "glitch", font: 3 },
    { time: 38730, word: "BULLDOZER", style: "glitch", font: 0 },

    // --- [00:39.53] Autobots roll out, hit the scene ---
    { time: 39530, word: "AUTOBOTS", style: "glitch", font: 1 },
    { time: 39935, word: "ROLL", style: "normal", font: 2 },
    { time: 40340, word: "OUT,", style: "normal", font: 3 },
    { time: 40745, word: "HIT", style: "normal", font: 0 },
    { time: 41150, word: "THE", style: "normal", font: 1 },
    { time: 41555, word: "SCENE", style: "normal", font: 2 },

    // --- [00:41.96] Fresh wax on the paint, it's clean ---
    { time: 41960, word: "FRESH", style: "normal", font: 3 },
    { time: 42324, word: "WAX", style: "normal", font: 0 },
    { time: 42688, word: "ON", style: "normal", font: 1 },
    { time: 43052, word: "THE", style: "normal", font: 2 },
    { time: 43416, word: "PAINT,", style: "normal", font: 3 },
    { time: 43780, word: "IT'S", style: "normal", font: 0 },
    { time: 44144, word: "CLEAN", style: "glitch", font: 1 },

    // --- [00:44.51] Hooligang light up the tires ---
    { time: 44510, word: "HOOLIGANG", style: "glitch", font: 2 },
    { time: 44916, word: "LIGHT", style: "normal", font: 3 },
    { time: 45322, word: "UP", style: "normal", font: 0 },
    { time: 45728, word: "THE", style: "normal", font: 1 },
    { time: 46134, word: "TIRES", style: "normal", font: 2 },

    // --- [00:46.54] The JZs poppin' and spittin' out fire ---
    { time: 46540, word: "THE", style: "normal", font: 3 },
    { time: 46883, word: "JZS", style: "normal", font: 0 },
    { time: 47226, word: "POPPIN'", style: "glitch", font: 1 },
    { time: 47569, word: "AND", style: "normal", font: 2 },
    { time: 47912, word: "SPITTIN'", style: "glitch", font: 3 },
    { time: 48255, word: "OUT", style: "normal", font: 0 },
    { time: 48598, word: "FIRE", style: "glitch", font: 1 },

    // --- [00:49.29] Never retire, stare and admire ---
    { time: 49290, word: "NEVER", style: "normal", font: 2 },
    { time: 49676, word: "RETIRE,", style: "normal", font: 3 },
    { time: 50062, word: "STARE", style: "normal", font: 0 },
    { time: 50448, word: "AND", style: "normal", font: 1 },
    { time: 50834, word: "ADMIRE", style: "normal", font: 2 },

    // --- [00:51.61] My drip don't expire (Oh my God, that is fire!) ---
    { time: 51610, word: "MY", style: "normal", font: 3 },
    { time: 51859, word: "DRIP", style: "normal", font: 0 },
    { time: 52108, word: "DON'T", style: "normal", font: 1 },
    { time: 52357, word: "EXPIRE", style: "normal", font: 2 },
    { time: 52606, word: "(OH", style: "normal", font: 3 },
    { time: 52855, word: "MY", style: "normal", font: 0 },
    { time: 53104, word: "GOD,", style: "glitch", font: 1 },
    { time: 53353, word: "THAT", style: "normal", font: 2 },
    { time: 53602, word: "IS", style: "normal", font: 3 },
    { time: 53851, word: "FIRE!)", style: "glitch", font: 0 },

    // --- [00:54.35] Runnin' chorus 2 ---
    { time: 54350, word: "RUNNIN'", style: "glitch", font: 1 },
    { time: 54601, word: "AND", style: "normal", font: 2 },
    { time: 54852, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 55103, word: "AND", style: "normal", font: 0 },
    { time: 55354, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 55605, word: "AND", style: "normal", font: 2 },
    { time: 55856, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 56107, word: "AND", style: "normal", font: 0 },
    { time: 56358, word: "RUNNIN',", style: "normal", font: 1 },
    { time: 56609, word: "RUN—", style: "glitch", font: 2 },

    // --- [00:56.86] ---
    { time: 56860, word: "RUNNIN'", style: "glitch", font: 3 },
    { time: 57113, word: "AND", style: "normal", font: 0 },
    { time: 57366, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 57619, word: "AND", style: "normal", font: 2 },
    { time: 57872, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 58125, word: "AND", style: "normal", font: 0 },
    { time: 58378, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 58631, word: "AND", style: "normal", font: 2 },
    { time: 58884, word: "RUNNIN',", style: "normal", font: 3 },
    { time: 59137, word: "RUN—", style: "glitch", font: 0 },

    // --- [00:59.39] ---
    { time: 59390, word: "RUNNIN'", style: "glitch", font: 1 },
    { time: 59642, word: "AND", style: "normal", font: 2 },
    { time: 59894, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 60146, word: "AND", style: "normal", font: 0 },
    { time: 60398, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 60650, word: "AND", style: "normal", font: 2 },
    { time: 60902, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 61154, word: "AND", style: "normal", font: 0 },
    { time: 61406, word: "RUNNIN',", style: "normal", font: 1 },
    { time: 61658, word: "RUN—", style: "glitch", font: 2 },

    // --- [01:01.91] ---
    { time: 61910, word: "RUNNIN'", style: "glitch", font: 3 },
    { time: 63178, word: "AND", style: "normal", font: 0 },
    { time: 64446, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 65714, word: "AND", style: "normal", font: 2 },
    { time: 66982, word: "RUNNIN'", style: "normal", font: 3 },
    { time: 68250, word: "AND", style: "normal", font: 0 },
    { time: 69518, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 70786, word: "AND—", style: "glitch", font: 2 },

    // --- [01:09.58] Stutter breakdown ---
    { time: 69580, word: "RUNNIN'", style: "glitch", font: 3 },
    { time: 69922, word: "AND", style: "normal", font: 0 },
    { time: 70264, word: "RUNNIN'", style: "normal", font: 1 },
    { time: 70606, word: "AND", style: "normal", font: 2 },
    { time: 70948, word: "RUN—", style: "glitch", font: 3 },
    { time: 71290, word: "RUNNIN'", style: "glitch", font: 0 },
    { time: 71632, word: "AND", style: "normal", font: 1 },
    { time: 71974, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 72316, word: "AND", style: "normal", font: 3 },
    { time: 72658, word: "RUN—", style: "glitch", font: 0 },
    { time: 73000, word: "RUN—", style: "glitch", font: 1 },

    // --- [01:12.32] Runnin'- Runnin'- Runnin' ---
    { time: 72320, word: "RUNNIN'—", style: "glitch", font: 2 },
    { time: 72943, word: "RUNNIN'—", style: "glitch", font: 3 },
    { time: 73566, word: "RUNNIN'—", style: "glitch", font: 0 },

    // --- [01:14.19] 'Cause I'm shell shocked like a Koopa Troopa ---
    { time: 74190, word: "'CAUSE", style: "normal", font: 1 },
    { time: 74512, word: "I'M", style: "normal", font: 2 },
    { time: 74834, word: "SHELL", style: "normal", font: 3 },
    { time: 75156, word: "SHOCKED", style: "glitch", font: 0 },
    { time: 75478, word: "LIKE", style: "normal", font: 1 },
    { time: 75800, word: "A", style: "normal", font: 2 },
    { time: 76122, word: "KOOPA", style: "normal", font: 3 },
    { time: 76444, word: "TROOPA", style: "normal", font: 0 },

    // --- [01:17.09] Everybody knows that I'm super, super, Super Saiyan ---
    { time: 77090, word: "EVERYBODY", style: "normal", font: 1 },
    { time: 77522, word: "KNOWS", style: "normal", font: 2 },
    { time: 77954, word: "THAT", style: "normal", font: 3 },
    { time: 78386, word: "I'M", style: "normal", font: 0 },
    { time: 78818, word: "SUPER,", style: "normal", font: 1 },
    { time: 79250, word: "SUPER,", style: "normal", font: 2 },
    { time: 79682, word: "SUPER", style: "glitch", font: 3 },
    { time: 80114, word: "SAIYAN", style: "glitch", font: 0 },

    // --- [01:20.55] I was born indestructible ---
    { time: 80550, word: "I", style: "normal", font: 1 },
    { time: 81022, word: "WAS", style: "normal", font: 2 },
    { time: 81494, word: "BORN", style: "normal", font: 3 },
    { time: 81966, word: "INDESTRUCTIBLE", style: "glitch", font: 0 },

    // --- [01:22.44] Now I'm always goin' ham like a Lunchable ---
    { time: 82440, word: "NOW", style: "normal", font: 1 },
    { time: 82720, word: "I'M", style: "normal", font: 2 },
    { time: 83000, word: "ALWAYS", style: "normal", font: 3 },
    { time: 83280, word: "GOIN'", style: "normal", font: 0 },
    { time: 83560, word: "HAM", style: "normal", font: 1 },
    { time: 83840, word: "LIKE", style: "normal", font: 2 },
    { time: 84120, word: "A", style: "normal", font: 3 },
    { time: 84400, word: "LUNCHABLE", style: "normal", font: 0 },

    // --- [01:24.68] I'ma stay running, this view is stunning ---
    { time: 84680, word: "I'MA", style: "normal", font: 1 },
    { time: 85032, word: "STAY", style: "normal", font: 2 },
    { time: 85384, word: "RUNNING,", style: "normal", font: 3 },
    { time: 85736, word: "THIS", style: "normal", font: 0 },
    { time: 86088, word: "VIEW", style: "normal", font: 1 },
    { time: 86440, word: "IS", style: "normal", font: 2 },
    { time: 86792, word: "STUNNING", style: "normal", font: 3 },

    // --- [01:27.15] My blood is rushing, you got me blushing ---
    { time: 87150, word: "MY", style: "normal", font: 0 },
    { time: 87473, word: "BLOOD", style: "normal", font: 1 },
    { time: 87796, word: "IS", style: "normal", font: 2 },
    { time: 88119, word: "RUSHING,", style: "glitch", font: 3 },
    { time: 88442, word: "YOU", style: "normal", font: 0 },
    { time: 88765, word: "GOT", style: "normal", font: 1 },
    { time: 89088, word: "ME", style: "normal", font: 2 },
    { time: 89411, word: "BLUSHING", style: "normal", font: 3 },

    // --- [01:29.74] I must keep trucking, won't catch me bugging ---
    { time: 89740, word: "I", style: "normal", font: 0 },
    { time: 90050, word: "MUST", style: "normal", font: 1 },
    { time: 90360, word: "KEEP", style: "normal", font: 2 },
    { time: 90670, word: "TRUCKING,", style: "normal", font: 3 },
    { time: 90980, word: "WON'T", style: "normal", font: 0 },
    { time: 91290, word: "CATCH", style: "normal", font: 1 },
    { time: 91600, word: "ME", style: "normal", font: 2 },
    { time: 91910, word: "BUGGING", style: "glitch", font: 3 },

    // --- [01:32.22] I'm the Omega, end of discussion ---
    { time: 92220, word: "I'M", style: "normal", font: 0 },
    { time: 92651, word: "THE", style: "normal", font: 1 },
    { time: 93082, word: "OMEGA,", style: "normal", font: 2 },
    { time: 93513, word: "END", style: "normal", font: 3 },
    { time: 93944, word: "OF", style: "normal", font: 0 },
    { time: 94375, word: "DISCUSSION", style: "normal", font: 1 },

    // --- [01:34.81] Hooligang who? Cozy Coupe, that's the ticket ---
    { time: 94810, word: "HOOLIGANG", style: "glitch", font: 2 },
    { time: 95206, word: "WHO?", style: "normal", font: 3 },
    { time: 95602, word: "COZY", style: "normal", font: 0 },
    { time: 95998, word: "COUPE,", style: "normal", font: 1 },
    { time: 96394, word: "THAT'S", style: "normal", font: 2 },
    { time: 96790, word: "THE", style: "normal", font: 3 },
    { time: 97186, word: "TICKET", style: "normal", font: 0 },

    // --- [01:37.98] Shoes, Reeboks in twos when I choose to kick it ---
    { time: 97980, word: "SHOES,", style: "normal", font: 1 },
    { time: 98320, word: "REEBOKS", style: "normal", font: 2 },
    { time: 98660, word: "IN", style: "normal", font: 3 },
    { time: 99000, word: "TWOS", style: "normal", font: 0 },
    { time: 99340, word: "WHEN", style: "normal", font: 1 },
    { time: 99680, word: "I", style: "normal", font: 2 },
    { time: 100020, word: "CHOOSE", style: "normal", font: 3 },
    { time: 100360, word: "TO", style: "normal", font: 0 },
    { time: 100700, word: "KICK", style: "normal", font: 1 },
    { time: 101040, word: "IT", style: "normal", font: 2 },

    // --- [01:41.04] Fenced like a picket ---
    { time: 101040, word: "FENCED", style: "normal", font: 3 },
    { time: 101365, word: "LIKE", style: "normal", font: 0 },
    { time: 101690, word: "A", style: "normal", font: 1 },
    { time: 102015, word: "PICKET", style: "normal", font: 2 },

    // --- [01:42.34] Eyes stay glued and the style stay wicked ---
    { time: 102340, word: "EYES", style: "normal", font: 3 },
    { time: 102647, word: "STAY", style: "normal", font: 0 },
    { time: 102954, word: "GLUED", style: "normal", font: 1 },
    { time: 103261, word: "AND", style: "normal", font: 2 },
    { time: 103568, word: "THE", style: "normal", font: 3 },
    { time: 103875, word: "STYLE", style: "normal", font: 0 },
    { time: 104182, word: "STAY", style: "normal", font: 1 },
    { time: 104489, word: "WICKED", style: "glitch", font: 2 },

    // --- [01:44.80] Swing through ya hood, Spider-Man ---
    { time: 104800, word: "SWING", style: "normal", font: 3 },
    { time: 105290, word: "THROUGH", style: "normal", font: 0 },
    { time: 105780, word: "YA", style: "normal", font: 1 },
    { time: 106270, word: "HOOD,", style: "normal", font: 2 },
    { time: 106760, word: "SPIDER-MAN", style: "glitch", font: 3 },

    // --- [01:47.25] Initial D, drift Japan ---
    { time: 107250, word: "INITIAL", style: "normal", font: 0 },
    { time: 107892, word: "D,", style: "normal", font: 1 },
    { time: 108534, word: "DRIFT", style: "normal", font: 2 },
    { time: 109176, word: "JAPAN", style: "normal", font: 3 },

    // --- [01:49.82] Starving wolf, Duran Duran ---
    { time: 109820, word: "STARVING", style: "normal", font: 0 },
    { time: 110400, word: "WOLF,", style: "normal", font: 1 },
    { time: 110980, word: "DURAN", style: "normal", font: 2 },
    { time: 111560, word: "DURAN", style: "normal", font: 3 },

    // --- [01:52.14] Green light, red light (Don't stop when I'm runnin' like) ---
    { time: 112140, word: "GREEN", style: "normal", font: 0 },
    { time: 112425, word: "LIGHT,", style: "normal", font: 1 },
    { time: 112710, word: "RED", style: "normal", font: 2 },
    { time: 112995, word: "LIGHT", style: "normal", font: 3 },
    { time: 113280, word: "(DON'T", style: "normal", font: 0 },
    { time: 113565, word: "STOP", style: "normal", font: 1 },
    { time: 113850, word: "WHEN", style: "normal", font: 2 },
    { time: 114135, word: "I'M", style: "normal", font: 3 },
    { time: 114420, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 114705, word: "LIKE)", style: "normal", font: 1 },

    // --- [01:54.99] Runnin' chorus 3 ---
    { time: 114990, word: "RUNNIN'", style: "glitch", font: 2 },
    { time: 115242, word: "AND", style: "normal", font: 3 },
    { time: 115494, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 115746, word: "AND", style: "normal", font: 1 },
    { time: 115998, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 116250, word: "AND", style: "normal", font: 3 },
    { time: 116502, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 116754, word: "AND", style: "normal", font: 1 },
    { time: 117006, word: "RUNNIN',", style: "normal", font: 2 },
    { time: 117258, word: "RUN—", style: "glitch", font: 3 },

    // --- [01:57.51] ---
    { time: 117510, word: "RUNNIN'", style: "glitch", font: 0 },
    { time: 117763, word: "AND", style: "normal", font: 1 },
    { time: 118016, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 118269, word: "AND", style: "normal", font: 3 },
    { time: 118522, word: "RUNNIN'", style: "normal", font: 0 },
    { time: 118775, word: "AND", style: "normal", font: 1 },
    { time: 119028, word: "RUNNIN'", style: "normal", font: 2 },
    { time: 119281, word: "AND", style: "normal", font: 3 },
    { time: 119534, word: "RUNNIN',", style: "normal", font: 0 },
    { time: 119787, word: "RUN—", style: "glitch", font: 1 },

    // --- [02:00.04] ---
  ];

  // --- Font Classes for Variety ---
  const FONT_CLASSES = [
    "font-serif tracking-widest", // Style 0: Strong, Serious
    "font-mono italic", // Style 1: Code-like, Italic
    "font-sans font-extrabold", // Style 2: Standard, Ultra-bold
    "font-[cursive] border-4 border-white p-2", // Style 3: Crazy/Cursive look (using system cursive)
  ];

  const [currentWord, setCurrentWord] = useState<WordTiming>({
    time: 0,
    word: "...",
    style: "normal",
    font: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync internal isPlaying state with external musicOn prop
  useEffect(() => {
    if (musicOn !== isPlaying) {
      setIsPlaying(musicOn);
      const audio = audioRef.current;
      if (audio) {
        if (musicOn) {
          audio.currentTime = 0;
          setCurrentWord({
            time: 0,
            word: "...",
            style: "normal",
            font: 0,
          });
          audio.play().catch((e) => {
            console.error("Failed to play audio:", e);
          });
        } else {
          audio.pause();
        }
      }
    }
  }, [musicOn, isPlaying]);

  // Function to apply the word style
  const getWordClasses = useMemo(() => {
    let classes = `transition-all duration-100 ease-in-out text-7xl sm:text-7xl lg:text-9xl font-black uppercase text-white ${
      FONT_CLASSES[currentWord.font % FONT_CLASSES.length]
    }`;

    if (currentWord.style === "glitch") {
      classes += " glitch-text text-red-400";
    } else {
      classes += " text-white";
    }
    return classes;
  }, [currentWord]);

  // Main synchronization effect using audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    let frameId: number;
    let wordIndex = 0;

    const checkTime = () => {
      const currentTime = audio.currentTime * 1000; // Convert to milliseconds

      // Find the next word whose time has passed
      while (
        wordIndex < LYRICS.length &&
        currentTime >= LYRICS[wordIndex].time
      ) {
        setCurrentWord(LYRICS[wordIndex]);
        wordIndex++;
      }

      if (wordIndex < LYRICS.length) {
        frameId = requestAnimationFrame(checkTime);
      } else if (currentTime > LYRICS[LYRICS.length - 1].time + 1000) {
        // Stop playback after the sequence is finished
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentWord({
          time: 0,
          word: "SYNC ENDED",
          style: "normal",
          font: 0,
        });
      } else {
        frameId = requestAnimationFrame(checkTime);
      }
    };

    // Start checking time when audio starts playing
    const handlePlay = () => {
      if (isPlaying) {
        frameId = requestAnimationFrame(checkTime);
      }
    };
    const handlePause = () => {
      cancelAnimationFrame(frameId);
    };
    const handleEnded = () => {
      cancelAnimationFrame(frameId);
      setIsPlaying(false);
      setCurrentWord({ time: 0, word: "FINISHED", style: "normal", font: 0 });
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Start the loop if the audio is already playing when component mounts/updates
    if (audio.paused === false) {
      frameId = requestAnimationFrame(checkTime);
    }

    return () => {
      cancelAnimationFrame(frameId);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setMusicOn(false);
    } else {
      // Reset the time and start the word index from 0
      audio.currentTime = 0;
      setCurrentWord({
        time: 0,
        word: "HOOLIGANG...",
        style: "normal",
        font: 0,
      });
      audio.play().catch((e) => {
        console.error("Failed to play audio:", e);
        // Handle case where playback is blocked (e.g., without user interaction)
      });
      setMusicOn(true);
    }
  };

  // Remove auto-play - let navbar control music state

  return (
    <div className="absolute w-screen h-screen top-0 left-0 opacity-20 bg-gray-900/5 flex flex-col items-center justify-center p-4 -z-1">
      {/* Custom CSS for the Glitch Effect */}
      <style>
        {`
        @keyframes text-glitch {
          0% { transform: translate(0); text-shadow: 2px 0 0 red, -2px 0 0 blue; }
          20% { transform: translate(-3px, 3px); text-shadow: 0px 3px 0 yellow, -3px 0 0 blue; }
          40% { transform: translate(2px, -2px); text-shadow: 3px -3px 0 cyan, -2px 2px 0 red; }
          60% { transform: translate(-5px, 5px); text-shadow: -5px 0 0 magenta, 5px 0 0 lime; }
          80% { transform: translate(1px, -1px); text-shadow: 1px 1px 0 red, -1px -1px 0 blue; }
          100% { transform: translate(0); text-shadow: 2px 0 0 red, -2px 0 0 blue; }
        }

        .glitch-text {
          animation: text-glitch 0.3s infinite alternate;
        }

        /* Define system fonts for variety */
        .font-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
        .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .font-\\[cursive\\] { font-family: cursive; }
        `}
      </style>

      {/* Audio Element (Hidden) */}
      <audio ref={audioRef} preload="auto">
        {/*
          ACTION REQUIRED: Place your audio file in the public folder (e.g., `/public/assets/hooligang.mp3`). The path is set to `/assets/hooligang.mp3`.
        */}
        <source src="/assets/hooligang.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Display Area */}
      <div className="flex-grow flex items-center justify-center h-[90vh] w-full"
      style={{
        display: musicOn ? "flex" : "none",
      }}
      >
        <h1 key={currentWord.time} className={getWordClasses}>
          {currentWord.word}
        </h1>
      </div>

      {/* Controls */}
      {/* <div className="w-full max-w-lg p-6 bg-gray-800 rounded-xl shadow-2xl flex flex-col items-center space-y-4">
        <button
          onClick={togglePlay}
          className={`w-full py-3 px-6 text-xl font-bold uppercase rounded-lg transition transform duration-200 ease-in-out
            ${
              isPlaying
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50 active:scale-95"
                : "bg-green-500 hover:bg-green-600 text-gray-900 shadow-lg shadow-green-500/50 active:scale-95"
            }`}
        >
          {isPlaying ? "PAUSE SYNC" : "START HOOLIGANG"}
        </button>
        <p className="text-sm text-gray-400 text-center">
          <br />
          Current Time:{" "}
          <span className="text-white font-mono">
            {audioRef.current
              ? audioRef.current.currentTime.toFixed(2)
              : "0.00"}
            s
          </span>
        </p>
      </div> */}
    </div>
  );
}
