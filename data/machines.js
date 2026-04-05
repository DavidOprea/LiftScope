//data/machines.js

/*
  Ab Crunch Machine
  Assisted Pull Up
  Bench Press
  Cable Machine
  Hack Squat
  Hyper Extension Machine
  Lat Pulldown
  Lying Leg Curl
  Smith Machine
  Treadmill
*/

export const MACHINES = [
  {
    id: "Ab Crunch Machine",
    name: "AB CRUNCH MACHINE",
    muscle_groups: ["Abs"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577117/ab_crunch_gmkzew.mp4",
    description: "Sit on the machine and select a weight. Grip the handles and crunch forward, engaging your abs. Slowly return to the starting position."
  },
  {
    id: "Assisted Pull Up",
    name: "Assisted Pull Up",
    muscle_groups: ["Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1774986097/assisted_pull_up_bnshzo.mp4",
    description: "This machine has two adjustable pulleys. With these pulleys you can perform a variety of exercises depending on the height and angle you set the pulleys at."
  },
  {
    id: "Bench Press",
    name: "BENCH PRESS",
    muscle_groups: ["Chest", "Triceps", "Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577074/bench_press_vfzqkf.mp4",
    description: "Lie on the bench with feet flat on the floor. Grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press it back up."
  },
  {
    id: "Cable Machine",
    name: "CABLE MACHINE",
    muscle_groups: ["Chest", "Back", "Shoulders", "Arms"],
    image_loc: require("../assets/images/cable_crossover.jpg"),
    description: "Sit and grip the handles at chest level. Press forward until arms are extended, keeping your back flat against the pad. Slowly return to start."
  },
  {
    id: "Hack Squat Machine",
    name: "HACK SQUAT",
    muscle_groups: ["Quads", "Hamstrings", "Glutes"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577563/hack_squat_gglzrt.mp4",
    description: "Stand on the platform with shoulders under the pads. Lower your body by bending your knees until thighs are parallel to the platform, then press back up."
  },
  {
    id: "Hyperextension Machine",
    name: "HYPEREXTENSION MACHINE",
    muscle_groups: ["Lower Back", "Glutes"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1774988279/hyperextension_h7hzkn.mp4",
    description: "Position yourself on the machine with your hips against the pad and feet secured. Lower your upper body towards the floor, then raise back up until your body is in a straight line."
  },
  {
    id: "Lat Pulldown Machine",
    name: "LAT PULLDOWN",
    muscle_groups: ["Lats", "Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968213/cable_lat_pulldown_ij50xe.mp4",
    description: "Seated machine with thigh pads. Pull the bar down to your collarbone, squeezing your shoulder blades together."
  },
  {
    id: "Lying Leg Curl Machine",
    name: "LYING LEG CURL",
    muscle_groups: ["Hamstrings"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577798/lying_leg_curl_ixomr6.mp4",
    description: "Lie face down on the machine with ankles under the roller. Curl your legs up towards your glutes, then slowly lower back down."
  },
  {
    id: "Triceps Extension Machine",
    name: "TRICEPS EXTENSION",
    muscle_groups: ["Triceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577826/tricep_extension_fg2kua.mp4",
    description: "Sit with back against pad and grip handles above your head. Extend your arms upward until they are straight, then slowly return to the starting position."
  },
  {
    id: "Smith Machine",
    name: "SMITH MACHINE",
    muscle_groups: ["Chest", "Arms", "Legs"],
    image_loc: require("../assets/images/smith_machine.png"),
    description: "The Smith Machine is a versatile piece of equipment that allows you to perform a variety of exercises such as squats, bench presses, and shoulder presses. The barbell is fixed within steel rails, providing stability and safety during your workout."
  },
  {
    id: "Treadmill",
    name: "TREADMILL",
    muscle_groups: ["Cardio"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1774988471/treadmill_tx99rb.mp4",
    description: "The treadmill is a popular cardio machine that allows you to walk, jog, or run indoors. It typically features adjustable speed and incline settings, making it suitable for users of all fitness levels."
  }
];