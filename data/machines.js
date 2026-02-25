//data/machines.js

/*
Bicep Curl Machine
Chess Press Machine
Chest Fly Machine
Dip or Chin-Up Machine
Lat Pull Down
Lateral Raises Machine
Leg Curl Machine
Leg Extension Machine
Leg Press Machine
Seated Cable Rows
Seated Dip Machine
Shoulder Press Machine
smith machine
Finished writing!
*/

export const MACHINES = [
  {
    id: "Bicep Curl Machine",
    name: "BICEP CURL MACHINE",
    muscle_groups: ["Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968214/bicep_curl_odkey9.mp4",
    description: "Sit on the machine and select a weight. Grip the handles and curl your arms towards your shoulders. Slowly return to the starting position."
  },
  {
    id: "Chest Fly Machine",
    name: "CHEST FLY",
    muscle_groups: ["Chest", "Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968213/chest_fly_qjdbzj.mp4",
    description: "Sit on the machine and select a weight. Grip the handles and bring them together in front of your chest, keeping a slight bend in your elbows. Slowly return to the starting position."
  },
  {
    id: "Chest Press Machine",
    name: "CHEST PRESS",
    muscle_groups: ["Chest", "Triceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771969351/chest_press_dbrib9.mp4",
    description: "Sit and grip the handles at chest level. Press forward until arms are extended, keeping your back flat against the pad. Slowly return to start."
  },
  {
    id: "Dip/Chin-Up Station",
    name: "DIP/CHIN-UP STATION",
    muscle_groups: ["Chest", "Triceps", "Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968215/dips_mgsa2m.mp4",
    description: "Grip the parallel bars and lift yourself up. Lower your body by bending your elbows until shoulders are below elbows, then press back up."
  },
  {
    id: "Lat Pulldown Machine",
    name: "LAT PULLDOWN",
    muscle_groups: ["Lats", "Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968213/cable_lat_pulldown_ij50xe.mp4",
    description: "Seated machine with thigh pads. Pull the bar down to your collarbone, squeezing your shoulder blades together."
  },
  {
    id: "Lateral Raise Machine",
    name: "LATERAL RAISE",
    muscle_groups: ["Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968213/lateral_raise_jryf5i.mp4",
    description: "Sit with back against pad and grip handles at shoulder height. Raise your arms to the sides until they are parallel to the floor, then slowly lower back down."
  },
  {
    id: "Leg Extension Machine",
    name: "LEG EXTENSION",
    muscle_groups: ["Quads"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968257/leg_extension_or6ti5.mp4",
    description: "Sit with back against pad and feet under the roller. Extend your legs until they are straight, then slowly lower back down."
  },
  {
    id: "Leg Press Machine",
    name: "LEG PRESS",
    muscle_groups: ["Quads", "Hamstrings", "Glutes", "Calves"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968215/leg_press_mmccn0.mp4",
    description: "Sit and place feet shoulder-width on platform. Lower weight until knees are at 90 degrees, then press through your entire foot."
  },
  {
    id: "Leg Curl Machine",
    name: "LEG CURL",
    muscle_groups: ["Hamstrings"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968212/seated_leg_curl_gjymzb.mp4",
    description: "Sit with back against pad and legs under the roller. Curl your legs towards your glutes, then slowly return to the starting position."
  },
  {
    id: "Seated Cable Row",
    name: "SEATED CABLE ROW",
    muscle_groups: ["Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968214/seated_row_odh8dr.mp4",
    description: "Sit with feet on platform and knees slightly bent. Grip the handles and pull towards your torso, squeezing shoulder blades together."
  },
  {
    id: "Seated Dip Machine",
    name: "SEATED DIP MACHINE",
    muscle_groups: ["Triceps", "Chest", "Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968212/seated_dip_elkx3x.mp4",
    description: "Sit on the machine and grip the handles. Push down to lift your body, then slowly return to the starting position."
  },
  {
    id: "Shoulder Press Machine",
    name: "SHOULDER PRESS",
    muscle_groups: ["Shoulders", "Triceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968214/shoulder_press_eafw54.mp4",
    description: "Sit with back against pad and grip handles at shoulder height. Press upward until arms are extended, avoiding locked elbows."
  },
  {
    id: "Smith Machine",
    name: "SMITH MACHINE",
    muscle_groups: ["Legs", "Chest", "Shoulders"],
    image_loc: require("../assets/images/smith_machine.png"),
    description: "Barbell fixed to vertical guides. Safer for solo training but restricts natural bar path. Used for squats, presses, and lunges."
  }
];