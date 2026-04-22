//data/machines.js

/*
  Ab Crunch Machine
  Assisted Pull Up
  Bench Press
  Cable Machine
  Hack Squat Machine
  Hyperextension Machine
  Lat Pulldown Machine
  Lying Leg Curl Machine
  Smith Machine
  Treadmill
*/

export const MACHINES = [
  {
    id: "Ab Crunch Machine",
    name: "AB CRUNCH MACHINE",
    muscle_groups: ["Abs"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577117/ab_crunch_gmkzew.mp4",
    video_transcript: "For the seated ab crunch you want to grab on here make sure you're adjusted right and you want to use your abs to pull not your arms you don't want to just jerk forward with your arms make sure you focus on your abs and get a good stretch all the way back and if you want to make it a little harder put your feet out in front of you.",
    description: "Sit on the machine and select a weight. Grip the handles and crunch forward, engaging your abs. Slowly return to the starting position."
  },
  {
    id: "Assisted Pull Up",
    name: "Assisted Pull Up",
    muscle_groups: ["Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1774986097/assisted_pull_up_bnshzo.mp4",
    video_transcript: "When you're using the assist P machine the first thing you need to be aware of is that unlike every other resistance machine the more weight you put on the easier machine will be so we're going to start off right the weight at the bottom if that is too easy for you you can always move it up to make it that a little bit harder now bring yourself up onto the feet platforms one hand on either the top or the bottom rail bring one knee onto the knee pad and let it lower down at this point you can step both knees on and pull yourself up you want to make sure all the way through the movement we're keeping it nice controlled up and down and also Contracting our back squeezing those lats in and keeping those elbows nice and tight into our backs to step off the machine you want to slowly bring yourself up to the top once again take one leg off onto that foot platform again bring that other knee off and take a step down.",
    description: "This machine has two adjustable pulleys. With these pulleys you can perform a variety of exercises depending on the height and angle you set the pulleys at."
  },
  {
    id: "Bench Press",
    name: "BENCH PRESS",
    muscle_groups: ["Chest", "Triceps", "Shoulders"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577074/bench_press_vfzqkf.mp4",
    video_transcript: "The bench press is a great exercise to build your upper body but only if you do it right step one to find your ideal grip width lay on the bench pull your elbows back to 90° then tuck them in until your thumbs line up with your nipples the space between your hands is how wide you should grip the bar step two stabilize Your Body by pushing your feet down with your quads and driving your knees out with your glutes bring your armpits down to your hips to activate your lats and finally extend your chest up to create a slight arch in your upper back step three stay tight and push the bar up off the rack then pull the bar over your shoulders re-engage your lats by thinking about bending the bar in half step four pull the bar down towards your lower chest while tucking your elbows in towards your sides think Arrow shape instead of t-shape step five pause for half a second on your chest and then push the bar up and back until your arms are straight over your shoulders congrats you've just done the perfect bench press.",
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
    video_transcript: "Place the back of your torso against the back pad of the machine and hook your shoulders under the shoulder pads provided position your legs in the platform using a shoulder width medium stance with the toes slightly pointed out place your arms on the side handles of the machine and disengage the safety bars which on most designs is done by moving the side handles from a facing front position to a diagonal position now straighten your legs without locking the knees this will be your starting position begin to slowly lower the unit by bending the knees as you maintain a straight posture with the head up and back on the pad at all times continue down until the angle between the upper leg and the calves becomes slightly less than 90° which is the point in which the upper legs are below parallel to the floor inhale as you perform this portion of the movement begin to raise the unit as you Exhale by pushing the floor mainly with the heel of your foot as you straighten the legs again and go back to the starting position repeat for the recommended amount of repetitions.",
    description: "Stand on the platform with shoulders under the pads. Lower your body by bending your knees until thighs are parallel to the platform, then press back up."
  },
  {
    id: "Hyperextension Machine",
    name: "HYPEREXTENSION MACHINE",
    muscle_groups: ["Lower Back", "Glutes"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1774988279/hyperextension_h7hzkn.mp4",
    video_transcript: "Lie face down on a hyperextensions bench tucking your ankle securely under the foot pad. Adjust the upper pad to allow you to bend at the waist without any restriction. With your body straight, cross your arms in front of you. You can hold a weight plate for extra resistance if needed. This will be your starting position. Now, start bending forward slowly at the hips as far as you can while keeping your back flat. Keep moving forward until you feel a nice stretch on the hamstrings and you can no longer keep going without rounding your back. Then slowly raise your torso back to the starting position.",
    description: "Position yourself on the machine with your hips against the pad and feet secured. Lower your upper body towards the floor, then raise back up until your body is in a straight line."
  },
  {
    id: "Lat Pulldown Machine",
    name: "LAT PULLDOWN",
    muscle_groups: ["Lats", "Back", "Biceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1771968213/cable_lat_pulldown_ij50xe.mp4",
    video_transcript: "How to use the lab pull down machine. Adjust the seat height so the thigh pads sit snugly on your thighs to prevent you from lifting up during the movement. Stand up slightly to reach the handles with an overhand grip. Sit back down holding on to the handles and secure your thighs under the pad. Sit tall with a slight lean back and pull the handles down towards your upper chest, focusing on squeezing your shoulder blades down and together. Then let the handles rise back up to return to the starting position. For beginners, use a weight where you can complete three sets of 10 reps.",
    description: "Seated machine with thigh pads. Pull the bar down to your collarbone, squeezing your shoulder blades together."
  },
  {
    id: "Lying Leg Curl Machine",
    name: "LYING LEG CURL",
    muscle_groups: ["Hamstrings"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577798/lying_leg_curl_ixomr6.mp4",
    video_transcript: "How to use the lying leg curl machine. Adjust the ankle pad so it rests just above your heels and below your calves. Lie face down on the body pad and grasp the handles to stabilize your upper body. Curl your heels upward towards your glutes in a smooth, controlled motion. Squeeze your hamstrings at the top of the movement. Slowly lower your legs and return to the starting position. For beginners, use a weight where you can complete three sets of 10 reps.",
    description: "Lie face down on the machine with ankles under the roller. Curl your legs up towards your glutes, then slowly lower back down."
  },
  {
    id: "Triceps Extension Machine",
    name: "TRICEPS EXTENSION",
    muscle_groups: ["Triceps"],
    video_loc: "https://res.cloudinary.com/ddhy8iyig/video/upload/v1772577826/tricep_extension_fg2kua.mp4",
    video_transcript: "the tricep machine extension is an isolation exercise used to target the muscles of the triceps the triceps are involved in nearly every push movement so strengthening the triceps is important if you want to continue to make gains on the bench press and military press you're going to set up this exercise in a seated position with your hands and a neutral grip on the handles you're going to then exhale and press the handles outward by extending the elbows slowly lower the handles back to the starting position and repeat for the desired number of repetitions.",
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
    video_transcript: "Hi, I'm Celine and today I'll be showing you how to set up and use a treadmill, which is a great bit of kit to work on your fitness and endurance. Let's get started by attaching the safety clip to the bottom of your top. To start the treadmill, press the green go button and begin with a nice slow walk. From here, we can adjust the speed to take it up to a faster walk, a jog or a run by simply pressing the speed buttons up and down until you find a comfortable pace. You can also adjust the treadmill angle using the incline buttons. This can make an intensity of your workout a little more challenging. Aim to walk on the treadmill for ten minutes to start with. If you'd like to increase the pace, you can also walk or jog at different intervals throughout. Do whatever feels right for you. When you're ready to finish your workout, all you need to do is press the red stop button. For any reason you need to stop quickly, you can press the emergency stop button.",
    description: "The treadmill is a popular cardio machine that allows you to walk, jog, or run indoors. It typically features adjustable speed and incline settings, making it suitable for users of all fitness levels."
  }
];