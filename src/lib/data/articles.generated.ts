// GENERATED FILE -- DO NOT EDIT BY HAND.
//
// Written by aidspace_backend/scripts/build_article_metadata.py, which derives
// every field below from the PDF text in datasets/documents.pkl using
// mistral-medium-latest. The RAG corpus itself stores only a positional doc_id, the
// researcher's folder name, and the PDF filename -- no title, abstract, author
// list or date. To change anything here, change the script and re-run it.
//
// Abstract bodies deliberately live in static/articles/abstracts.json instead,
// fetched on demand, so the homepage bundle stays small. See $lib/data/abstracts.
//
// CORPUS_FINGERPRINT identifies the ingested corpus this was built from. If the
// backend is re-ingested, doc_id values are reassigned by position and this
// dataset must be regenerated -- see findArticle() in ./articles.ts for the
// fallback that keeps search results working in the meantime.

import type { GeneratedArticle } from './articles';

export const CORPUS_FINGERPRINT = '76cab4142769548e';

export const generatedArticles: GeneratedArticle[] = [
 {
  "id": "3d-dava-enhancing-3d-point-cloud-data-reliability-for-e54a8a",
  "nodeNumber": "0000",
  "docId": "156",
  "sourceFile": "3D-DaVa-Enhancing 3D Point Cloud Data Reliability for Industrial Applications__ACM_Data_Quality_Journal.pdf",
  "researcher": "Phu_Nguyen",
  "title": "3D-DaVa: Enhancing 3D Point Cloud Data Reliability for Industrial Applications",
  "authors": [
   "Adela Nedisan Videsjorden",
   "Arda Goknil",
   "Sagar Sen",
   "Erik Johannes Husom",
   "Phu Nguyen"
  ],
  "publicationDate": "2018-03",
  "venue": "ACM Data Quality Journal",
  "doi": null,
  "keywords": [
   "3d point cloud",
   "data validation",
   "industrial applications",
   "data quality",
   "machine learning",
   "computer vision"
  ],
  "teaser": "The escalating incorporation of three-dimensional (3D) point cloud data across industrial applications highlights the necessity of assuring its reliability. The error-prone process of object digitization, the large data"
 },
 {
  "id": "3d-pointcloud-registration-in-the-wild-132253",
  "nodeNumber": "0001",
  "docId": "2",
  "sourceFile": "03.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "3D Pointcloud Registration In-the-wild",
  "authors": [
   "Peter Ørnulf Ivarsen",
   "Marianne Bakken",
   "Ahmed Mohammed"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "pointcloud registration",
   "slam",
   "lidar",
   "rgb-d",
   "industrial datasets",
   "generalization"
  ],
  "teaser": "This study assesses two state-of-the-art (SOTA) pointcloud registration approaches on industrially challenging datasets, focusing on two specific cases. The first case involves the application of Lidar-based"
 },
 {
  "id": "a-branch-and-cut-embedded-matheuristic-for-the-inventory-934e28",
  "nodeNumber": "0002",
  "docId": "69",
  "sourceFile": "2023_A branch-and-cut embedded matheuristic for the inventory routing problem.pdf",
  "researcher": "Henrik_Andersson",
  "title": "A branch-and-cut embedded matheuristic for the inventory routing problem",
  "authors": [
   "Jørgen Skålnes",
   "Simen T. Vadseth",
   "Henrik Andersson",
   "Magnus Stålhane"
  ],
  "publicationDate": "2023-07-17",
  "venue": "Computers & Operations Research",
  "doi": "10.1016/j.cor.2023.106353",
  "keywords": [
   "inventory routing problem",
   "matheuristic",
   "branch-and-cut",
   "dimacs implementation challenge",
   "vehicle routing problem",
   "optimization"
  ],
  "teaser": "This paper presents an improved version of the solution method that won the inventory routing problem track of the 12th DIMACS Implementation Challenge. The solution method is a branch-and-cut embedded matheuristic"
 },
 {
  "id": "a-branch-price-and-cut-algorithm-for-the-two-echelon-cdda4f",
  "nodeNumber": "0003",
  "docId": "66",
  "sourceFile": "2021_A Branch-Price-and-Cut Algorithm for the Two-Echelon Vehicle Routing Problem with Time Windows.pdf",
  "researcher": "Henrik_Andersson",
  "title": "A Branch-Price-and-Cut Algorithm for the Two-Echelon Vehicle Routing Problem with Time Windows",
  "authors": [
   "Tayeb Mhamedi",
   "Henrik Andersson",
   "Marilène Cherkesly",
   "Guy Desaulniers"
  ],
  "publicationDate": "2021-12-06",
  "venue": "Transportation Science",
  "doi": "10.1287/trsc.2021.1092",
  "keywords": [
   "column generation",
   "multi-echelon vehicle routing problem",
   "branch-price-and-cut",
   "dual-optimal inequalities",
   "city logistics",
   "time windows"
  ],
  "teaser": "In this paper, we propose an exact branch-price-and-cut (BPC) algorithm for the two-echelon vehicle routing problem with time windows. This problem arises in city logistics when high-capacity and low-capacity vehicles"
 },
 {
  "id": "a-column-generation-heuristic-for-the-dynamic-bicycle-fd37f8",
  "nodeNumber": "0004",
  "docId": "235",
  "sourceFile": "1.pdf",
  "researcher": "Steffen_Bakker",
  "title": "A column generation heuristic for the dynamic bicycle rebalancing problem",
  "authors": [
   "Marte D. Gleditsch",
   "Kristine Hagen",
   "Henrik Andersson",
   "Steffen J. Bakker",
   "Kjetil Fagerholt"
  ],
  "publicationDate": "2024",
  "venue": "European Journal of Operational Research",
  "doi": "10.1016/j.ejor.2022.07.004",
  "keywords": [
   "transportation",
   "bicycle sharing",
   "dynamic rebalancing",
   "column generation heuristic",
   "simulation",
   "operational research"
  ],
  "teaser": "Public bicycle sharing systems are becoming an essential part of the future urban mobility system. Real-time monitoring of the system state through sensors on bicycles and/or stations gives possibilities for advanced"
 },
 {
  "id": "a-comprehensive-model-of-the-psychology-of-environmental-29de69",
  "nodeNumber": "0005",
  "docId": "27",
  "sourceFile": "1-s2.0-S095937801300099X-main.pdf",
  "researcher": "Christian Klöckner",
  "title": "A comprehensive model of the psychology of environmental behaviour—A meta-analysis",
  "authors": [
   "Christian A. Klöckner"
  ],
  "publicationDate": "2013-06",
  "venue": "Global Environmental Change",
  "doi": "10.1016/j.gloenvcha.2013.05.014",
  "keywords": [
   "meta-analysis",
   "environmental psychology",
   "theory of planned behaviour",
   "norm-activation theory",
   "value-belief-norm theory",
   "behavioural change"
  ],
  "teaser": "To address global environmental challenges it is crucial to understand how humans make decisions about environmentally relevant behaviour, since a shift to alternative behaviours can make a relevant difference. This"
 },
 {
  "id": "a-dither-free-extremum-seeking-control-approach-using-1st-26eed4",
  "nodeNumber": "0006",
  "docId": "127",
  "sourceFile": "A_dither-free_extremum-seeking_control_approach_using_1st-order_least-squares_fits_for_gradient_estimation.pdf",
  "researcher": "Mark_Haring",
  "title": "A dither-free extremum-seeking control approach using 1st-order least-squares fits for gradient estimation",
  "authors": [
   "B.G.B. Hunnekens",
   "M.A.M. Haring",
   "N. van de Wouw",
   "H. Nijmeijer"
  ],
  "publicationDate": "2014-12",
  "venue": "53rd IEEE Conference on Decision and Control",
  "doi": "10.1109/CDC.2014.7039499",
  "keywords": [
   "extremum-seeking control",
   "gradient estimation",
   "least-squares fits",
   "asymptotic stability",
   "dither-free",
   "time-delay systems"
  ],
  "teaser": "In this paper, we present a novel type of extremum-seeking controller, which continuously uses past data of the performance map to estimate the gradient of this performance map by means of a 1st-order least squares fit."
 },
 {
  "id": "a-dual-level-stochastic-fleet-size-and-mix-problem-for-39cacf",
  "nodeNumber": "0007",
  "docId": "120",
  "sourceFile": "Stålhane et al (2021) - INFOR.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "A dual-level stochastic fleet size and mix problem for offshore wind farm maintenance operations",
  "authors": [
   "Magnus Stålhane",
   "Kamilla Hamre Bolstad",
   "Manu Joshi",
   "Lars Magnus Hvattum"
  ],
  "publicationDate": "2021-04-03",
  "venue": "INFOR: Information Systems and Operational Research",
  "doi": "10.1080/03155986.2020.1857629",
  "keywords": [
   "stochastic programming",
   "hierarchical planning",
   "multilevel planning",
   "mixed-integer programming",
   "integer l-shaped method",
   "multi-horizon"
  ],
  "teaser": "This paper studies the strategic problem of finding a cost optimal fleet of vessels to support maintenance operations at offshore wind farms. A dual-level stochastic model is formulated, taking into account both"
 },
 {
  "id": "a-framework-for-integrated-resource-planning-in-surgical-2a7ad8",
  "nodeNumber": "0008",
  "docId": "70",
  "sourceFile": "2024_A framework for integrated resource planning in surgical clinics.pdf",
  "researcher": "Henrik_Andersson",
  "title": "A framework for integrated resource planning in surgical clinics",
  "authors": [
   "Thomas Reiten Bovim",
   "Anders N. Gullhav",
   "Henrik Andersson",
   "Atle Riise"
  ],
  "publicationDate": "2025-01",
  "venue": "European Journal of Operational Research",
  "doi": "10.1016/j.ejor.2024.08.021",
  "keywords": [
   "or in health services",
   "surgery scheduling",
   "integrated resource planning",
   "integer programming",
   "simulation"
  ],
  "teaser": "The problem under study is based on the challenges faced by the Orthopaedic Clinic at St. Olav’s Hospital in Trondheim, Norway. Variations in demand and supply cause fluctuating waiting lists, and it is challenging to"
 },
 {
  "id": "a-game-approach-for-charging-station-placement-based-on-dbe910",
  "nodeNumber": "0009",
  "docId": "200",
  "sourceFile": "A_Game_Approach_for_Charging_Station_Placement_Based_on_User_Preferences_and_Crowdedness.pdf",
  "researcher": "Sebastien Gros",
  "title": "A Game Approach for Charging Station Placement Based on User Preferences and Crowdedness",
  "authors": [
   "Sangjun Bae",
   "Inmo Jang",
   "Sébastien Gros",
   "Balázs Kulcsár",
   "Jonas Hellgren"
  ],
  "publicationDate": "2022-04",
  "venue": "IEEE Transactions on Intelligent Transportation Systems",
  "doi": "10.1109/TITS.2020.3038938",
  "keywords": [
   "electric vehicle charging stations",
   "game theory",
   "clustering algorithm",
   "user preferences",
   "crowdedness",
   "optimization"
  ],
  "teaser": "The placement of electric vehicle charging stations (EVCSs), which encourages the rapid development of electric vehicles (EVs), should be considered from not only operational perspective such as minimizing installation"
 },
 {
  "id": "a-graded-approach-to-the-human-factors-validation-of-40511e",
  "nodeNumber": "0010",
  "docId": "155",
  "sourceFile": "Brarud-et-al-2019-Human factors Validation-HMIT-conference.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "A Graded Approach to the Human Factors Validation of Turbine Control System Digital Upgrade and Control Room Modernization",
  "authors": [
   "Per Øivind Braarud",
   "Håkan Svengren",
   "Paul Hunton",
   "Jeffrey Joe",
   "Lew Hanes"
  ],
  "publicationDate": "2019-02-09",
  "venue": "NPIC&HMIT 2019",
  "doi": null,
  "keywords": [
   "human factors",
   "integrated system validation",
   "control room modernization",
   "digitalization",
   "nuclear",
   "nureg-0711"
  ],
  "teaser": "The guidance for human factors validation of non-safety upgrades is limited. The NUREG-0711 review guide provides comprehensive guidance suitable for new builds or large-scale safety upgrades. Consequently,"
 },
 {
  "id": "a-learning-based-model-predictive-control-strategy-for-home-b6acf7",
  "nodeNumber": "0011",
  "docId": "201",
  "sourceFile": "A_Learning-Based_Model_Predictive_Control_Strategy_for_Home_Energy_Management_Systems.pdf",
  "researcher": "Sebastien Gros",
  "title": "A Learning-Based Model Predictive Control Strategy for Home Energy Management Systems",
  "authors": [
   "Wenqi Cai",
   "Shambhuraj Sawant",
   "Dirk Reinhardt",
   "Soroush Rastegarpour",
   "Sébastien Gros"
  ],
  "publicationDate": "2023-12-22",
  "venue": "IEEE Access",
  "doi": "10.1109/ACCESS.2023.3346324",
  "keywords": [
   "model predictive control",
   "reinforcement learning",
   "home energy management",
   "uncertainty",
   "heat pump",
   "battery storage"
  ],
  "teaser": "This paper presents a model predictive control (MPC)-based reinforcement learning (RL) approach for a home energy management system (HEMS). The house consists of an air-to-water heat pump connected to a hot water tank"
 },
 {
  "id": "a-levenberg-marquardt-algorithm-for-sparse-identification-49af94",
  "nodeNumber": "0012",
  "docId": "222",
  "sourceFile": "2203.12379v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "A Levenberg-Marquardt algorithm for sparse identification of dynamical systems",
  "authors": [
   "Mark Haring",
   "Esten Ingar Grøtli",
   "Signe Riemer-Sørensen",
   "Katrine Seel",
   "Kristian Gaustad Hanssen"
  ],
  "publicationDate": "2022-03",
  "venue": null,
  "doi": "10.48550/arXiv.2203.12379",
  "keywords": [
   "system identification",
   "sparse identification",
   "levenberg-marquardt",
   "dynamical systems",
   "machine learning",
   "neural networks"
  ],
  "teaser": "Low complexity of a system model is essential for its use in real-time applications. However, sparse identification methods commonly have stringent requirements that exclude them from being applied in an industrial"
 },
 {
  "id": "a-levenberg-marquardt-algorithm-for-sparse-identification-df3715",
  "nodeNumber": "0013",
  "docId": "128",
  "sourceFile": "A_Levenberg-Marquardt_Algorithm_for_Sparse_Identification_of_Dynamical_Systems.pdf",
  "researcher": "Mark_Haring",
  "title": "A Levenberg-Marquardt Algorithm for Sparse Identification of Dynamical Systems",
  "authors": [
   "Mark Haring",
   "Esten Ingar Grøtli",
   "Signe Riemer-Sørensen",
   "Katrine Seel",
   "Kristian Gaustad Hanssen"
  ],
  "publicationDate": "2022-03-22",
  "venue": "IEEE Transactions on Neural Networks and Learning Systems",
  "doi": "10.1109/TNNLS.2022.3157963",
  "keywords": [
   "sparse identification",
   "dynamical systems",
   "levenberg-marquardt",
   "neural networks",
   "system identification",
   "machine learning"
  ],
  "teaser": "Low complexity of a system model is essential for its use in real-time applications. However, sparse identification methods commonly have stringent requirements that exclude them from being applied in an industrial"
 },
 {
  "id": "a-levenberg-marquardt-algorithm-for-sparse-identification-ed55da",
  "nodeNumber": "0014",
  "docId": "49",
  "sourceFile": "Haring_ALevenbergMarquardtAlgorithmForSparseIdentificationOfDynamicalSystems2023.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "A Levenberg-Marquardt Algorithm for Sparse Identification of Dynamical Systems",
  "authors": [
   "Mark Haring",
   "Esten Ingar Grøtli",
   "Signe Riemer-Sørensen",
   "Katrine Seel",
   "Kristian Gaustad Hanssen"
  ],
  "publicationDate": "2022-03-22",
  "venue": "IEEE Transactions on Neural Networks and Learning Systems",
  "doi": "10.1109/TNNLS.2022.3157963",
  "keywords": [
   "sparse identification",
   "dynamical systems",
   "levenberg-marquardt",
   "neural networks",
   "system identification",
   "machine learning"
  ],
  "teaser": "Low complexity of a system model is essential for its use in real-time applications. However, sparse identification methods commonly have stringent requirements that exclude them from being applied in an industrial"
 },
 {
  "id": "a-look-ahead-policy-for-dynamic-bike-rebalancing-with-7699bd",
  "nodeNumber": "0015",
  "docId": "237",
  "sourceFile": "3.pdf",
  "researcher": "Steffen_Bakker",
  "title": "A Look-Ahead Policy for Dynamic Bike Rebalancing with Neighborhood Interactions",
  "authors": [
   "Steffen J.S. Bakker",
   "Mohamed Ben Ahmed",
   "Henrik Andersson",
   "Christian Håkon Torsten Inngjerdingen",
   "Simen Aksland Møller"
  ],
  "publicationDate": "2025-09-05",
  "venue": "Omega",
  "doi": null,
  "keywords": [
   "bike rebalancing",
   "inventory management",
   "vehicle routing",
   "pilot method",
   "simulation",
   "neighborhood interactions"
  ],
  "teaser": "Bike-sharing systems (BSSs) offer a flexible and eco-friendly transportation option in urban areas, but often encounter challenges due to imbalances in spatial and temporal demand. These imbalances can make it difficult"
 },
 {
  "id": "a-multi-start-route-improving-matheuristic-for-the-16d101",
  "nodeNumber": "0016",
  "docId": "121",
  "sourceFile": "Vadseth et al (2023) - IJPR.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "A multi-start route improving matheuristic for the production routeing problem",
  "authors": [
   "Simen T. Vadseth",
   "Henrik Andersson",
   "Magnus Stålhane",
   "Masoud Chitsaz"
  ],
  "publicationDate": "2023-01-03",
  "venue": "International Journal of Production Research",
  "doi": "10.1080/00207543.2022.2154402",
  "keywords": [
   "transportation",
   "production routing",
   "matheuristic",
   "inventory routing",
   "heuristic"
  ],
  "teaser": "This paper considers the multi-vehicle production routeing problem with a maximum-level replenishment policy. This is a well-established problem within vendor managed inventory where production, inventory and routeing"
 },
 {
  "id": "a-new-user-friendly-visual-environment-for-breast-mri-data-2e95b4",
  "nodeNumber": "0017",
  "docId": "23",
  "sourceFile": "5.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "A new user-friendly visual environment for breast MRI data analysis",
  "authors": [
   "Antonios Danelakis",
   "Dimitrios Verganelakis",
   "Theoharis Theoharis"
  ],
  "publicationDate": "2013-02",
  "venue": "Computer Methods and Programs in Biomedicine",
  "doi": "10.1016/j.cmpb.2012.12.007",
  "keywords": [
   "magnetic resonance imaging",
   "mammography",
   "data analysis",
   "cdss",
   "cad",
   "kinetics"
  ],
  "teaser": "In this paper a novel, user friendly visual environment for Breast MRI Data Analysis is presented (BreDAn). Given planar MRI images before and after IV contrast medium injection, BreDAn generates kinematic graphs, color"
 },
 {
  "id": "a-novel-hybrid-physics-data-driven-model-for-fractured-c5b2de",
  "nodeNumber": "0018",
  "docId": "105",
  "sourceFile": "spe-219110-pa.pdf",
  "researcher": "Knut-Andreas Lie",
  "title": "A Novel Hybrid Physics/Data-Driven Model for Fractured Reservoir Simulation",
  "authors": [
   "Billal Aslam",
   "Bicheng Yan",
   "Knut-Andreas Lie",
   "Stein Krogstad",
   "Olav Møyner",
   "Xupeng He"
  ],
  "publicationDate": "2024-12",
  "venue": "SPE Journal",
  "doi": "10.2118/219110-PA",
  "keywords": [
   "fractured reservoir simulation",
   "reduced-order model",
   "history matching",
   "principal component analysis",
   "hybrid physics/data-driven model",
   "discrete fracture modeling"
  ],
  "teaser": "Fractured reservoir simulation plays a crucial role in understanding various subsurface geo-energy recovery and storage processes, including shale gas/oil extraction, enhanced geothermal systems, and CO2 sequestration"
 },
 {
  "id": "a-systematic-review-of-data-quality-in-cps-and-iot-for-9aab8e",
  "nodeNumber": "0019",
  "docId": "157",
  "sourceFile": "A Systematic Review of Data Quality in CPS and IoT.pdf",
  "researcher": "Phu_Nguyen",
  "title": "A Systematic Review of Data Quality in CPS and IoT for Industry 4.0",
  "authors": [
   "Arda Goknil",
   "Phu Nguyen",
   "Sagar Sen",
   "Dimitra Politaki",
   "Harris Niavis",
   "Karl John Pedersen",
   "Abdillah Suyuthi",
   "Abhilash Anand",
   "Amina Ziegenbein"
  ],
  "publicationDate": "2023-07",
  "venue": "ACM Computing Surveys",
  "doi": "10.1145/3593043",
  "keywords": [
   "data quality",
   "iot",
   "cps",
   "industry 4.0",
   "systematic review",
   "edge-cloud continuum"
  ],
  "teaser": "The Internet of Things (IoT) and Cyber-Physical Systems (CPS) are the backbones of Industry 4.0, where data quality is crucial for decision support. Data quality in these systems can deteriorate due to sensor failures"
 },
 {
  "id": "accounting-for-optimal-control-in-the-sizing-of-isolated-215d77",
  "nodeNumber": "0020",
  "docId": "233",
  "sourceFile": "1.pdf",
  "researcher": "Simon_Halvdansson",
  "title": "Accounting for Optimal Control in the Sizing of Isolated Hybrid Renewable Energy Systems Using Imitation Learning",
  "authors": [
   "Simon Halvdansson",
   "Lucas Ferreira Bernardino",
   "Brage Rugstad Knudsen"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "model predictive control",
   "imitation learning",
   "stochastic mpc",
   "optimal sizing",
   "isolated energy systems",
   "renewable energy"
  ],
  "teaser": "Decarbonization of isolated or off-grid energy systems through phase-in of large shares of intermittent solar or wind generation requires co-installation of energy storage or continued use of existing fossil"
 },
 {
  "id": "action-unit-detection-in-3d-facial-videos-with-application-92bf18",
  "nodeNumber": "0021",
  "docId": "26",
  "sourceFile": "9.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "Action unit detection in 3D facial videos with application in facial expression retrieval and recognition",
  "authors": [
   "Antonios Danelakis",
   "Theoharis Theoharis",
   "Ioannis Pratikakis"
  ],
  "publicationDate": "2018-03-28",
  "venue": "Multimedia Tools and Applications",
  "doi": "10.1007/s11042-018-5699-9",
  "keywords": [
   "action unit detection",
   "3d facial videos",
   "facial expression retrieval",
   "facial expression recognition",
   "dynamic 3d mesh sequence",
   "support vector machine"
  ],
  "teaser": "This work introduces a new scheme for action unit detection in 3D facial videos. Sets of features that define action unit activation in a robust manner are proposed. These features are computed based on eight detected"
 },
 {
  "id": "adaptive-underwater-robotic-sampling-of-dispersal-dynamics-832acb",
  "nodeNumber": "0022",
  "docId": "45",
  "sourceFile": "Berget_AdaptiveUnderwaterRoboticSamplingOfDispersalDynamicsInTheCoastalOcean2019.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Adaptive Underwater Robotic Sampling of Dispersal Dynamics in the Coastal Ocean",
  "authors": [
   "Gunhild Elisabeth Berget",
   "Jo Eidsvik",
   "Morten Omholt Alver",
   "Frédéric Py",
   "Esten Ingar Grøtli",
   "Tor Arne Johansen"
  ],
  "publicationDate": "2019-06-03",
  "venue": "The International Symposium on Robotics Research",
  "doi": null,
  "keywords": [
   "adaptive sampling",
   "gaussian processes",
   "auv",
   "oceanography",
   "particle dynamics",
   "robotics"
  ],
  "teaser": "To get a better understanding of the highly nonlinear processes driving the ocean, efficient and informative sampling is critical. By combining robotic sampling with ocean models we are able to choose informative"
 },
 {
  "id": "addressing-long-term-uncertainty-in-energy-system-98fa0d",
  "nodeNumber": "0023",
  "docId": "240",
  "sourceFile": "6.pdf",
  "researcher": "Steffen_Bakker",
  "title": "Addressing Long-Term Uncertainty in Energy System Optimization: A cost-driven scenario reduction approach",
  "authors": [
   "Céline Pagnier",
   "Steffen J.S. Bakker",
   "Pernille Seljom",
   "Asgeir Tomasgard"
  ],
  "publicationDate": "2025-10-12",
  "venue": null,
  "doi": null,
  "keywords": [
   "energy system model",
   "stochastic programming",
   "scenario generation",
   "long-term uncertainty",
   "scenario reduction",
   "cost-driven"
  ],
  "teaser": "Assumptions play a central role in developing long-term energy system models, yet many are highly uncertain and may critically affect results. Most studies rely on deterministic approaches, while stochastic programming"
 },
 {
  "id": "addressing-sample-efficiency-and-model-bias-in-model-based-36da8f",
  "nodeNumber": "0024",
  "docId": "11",
  "sourceFile": "model_based_reinforcement_learning.pdf",
  "researcher": "Akhil S Anand",
  "title": "Addressing Sample Efficiency and Model-bias in Model-based Reinforcement Learning",
  "authors": [
   "Akhil S Anand",
   "Jens Erik Kveen",
   "Fares Abu-Dakka",
   "Esten Ingar Grøtli",
   "Jan Tommy Gravdahl"
  ],
  "publicationDate": "2022",
  "venue": "2022 21st IEEE International Conference on Machine Learning and Applications (ICMLA)",
  "doi": "10.1109/ICMLA55696.2022.00009",
  "keywords": [
   "reinforcement learning",
   "model-based learning",
   "sample efficiency",
   "model-bias",
   "robotics",
   "neural networks"
  ],
  "teaser": "Model-based reinforcement learning promises to be an effective way to bring reinforcement learning to real-world robotic systems by offering a sample efficient learning approach compared to model-free reinforcement"
 },
 {
  "id": "adoption-and-diffusion-of-heating-systems-in-norway-089c3f",
  "nodeNumber": "0025",
  "docId": "30",
  "sourceFile": "1-s2.0-S2210422413000427-main.pdf",
  "researcher": "Christian Klöckner",
  "title": "Adoption and diffusion of heating systems in Norway: Coupling agent-based modeling with empirical research",
  "authors": [
   "Bertha Maya Sopha",
   "Christian A. Klöckner",
   "Edgar G. Hertwich"
  ],
  "publicationDate": "2013-07-12",
  "venue": "Environmental Innovation and Societal Transitions",
  "doi": "10.1016/j.eist.2013.06.001",
  "keywords": [
   "adoption",
   "agent-based modeling",
   "empirical",
   "heating system",
   "norway",
   "diffusion"
  ],
  "teaser": "Sophisticated modeling techniques can help policy makers examine technology interventions aimed at addressing climate change mitigation and other environmental issues. Since adoption of a new technology is not only"
 },
 {
  "id": "advanced-context-sensitive-access-management-for-edge-eb84e4",
  "nodeNumber": "0026",
  "docId": "161",
  "sourceFile": "Journal_paper_EDSaaS__Context_aware_Authorization_for_Multi_tenancy_Edge_based_IoT_Data_Sharing_as_a_Service.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Advanced Context-Sensitive Access Management for Edge-Driven IoT Data Sharing as a Service",
  "authors": [
   "Phu H. Nguyen",
   "Huu-Ha Nguyen",
   "Phu H. Phung",
   "Hong-Linh Truong",
   "Thomas Cheung"
  ],
  "publicationDate": "2025",
  "venue": "ACM Transactions on Internet Technology",
  "doi": "10.1145/3721430",
  "keywords": [
   "iot",
   "edge computing",
   "access control",
   "context-aware authorization",
   "multi-tenancy",
   "data sharing"
  ],
  "teaser": "This work addresses the challenges of securing and enabling trust in IoT data sharing across the IoT devices-Edge-Cloud continuum by introducing a novel dynamic context-based policy enforcement framework. The framework"
 },
 {
  "id": "agentic-scientific-simulation-execution-grounded-model-1825d7",
  "nodeNumber": "0027",
  "docId": "100",
  "sourceFile": "2603.00214v1.pdf",
  "researcher": "Knut-Andreas Lie",
  "title": "Agentic Scientific Simulation: Execution-Grounded Model Construction and Reconstruction",
  "authors": [
   "Knut-Andreas Lie",
   "Olav Møyner",
   "Elling Svee",
   "Jakob Torben"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "agentic simulation",
   "scientific computing",
   "llm agents",
   "model construction",
   "reproducibility",
   "pde simulation"
  ],
  "teaser": "We ask whether an LLM agent can serve as a genuine scientific assistant for physics-based simulation: given a natural-language description of a model, can it produce an executable, physically valid simulation"
 },
 {
  "id": "agentic-scientific-simulation-execution-grounded-model-eefe3c",
  "nodeNumber": "0028",
  "docId": "135",
  "sourceFile": "2603.00214v1.pdf",
  "researcher": "Olav Møyner",
  "title": "Agentic Scientific Simulation: Execution-Grounded Model Construction and Reconstruction",
  "authors": [
   "Knut-Andreas Lie",
   "Olav Møyner",
   "Elling Svee",
   "Jakob Torben"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "scientific simulation",
   "agentic systems",
   "large language models",
   "model construction",
   "reproducibility",
   "pde solvers"
  ],
  "teaser": "We ask whether an LLM agent can serve as a genuine scientific assistant for physics-based simulation: given a natural-language description of a model, can it produce an executable, physically valid simulation"
 },
 {
  "id": "all-ai-models-are-wrong-but-some-are-optimal-187b83",
  "nodeNumber": "0029",
  "docId": "192",
  "sourceFile": "2501.06086v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "All AI Models are Wrong, but Some are Optimal",
  "authors": [
   "Akhil S Anand",
   "Shambhuraj Sawant",
   "Dirk Reinhardt",
   "Sebastien Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "predictive ai models",
   "sequential decision-making",
   "model-based optimization",
   "reinforcement learning",
   "markov decision process",
   "decision-oriented models"
  ],
  "teaser": "AI models that predict the future behavior of a system (a.k.a. predictive AI models) are central to intelligent decision-making. However, decision-making using predictive AI models often results in suboptimal"
 },
 {
  "id": "an-adaptive-large-neighborhood-search-heuristic-for-the-dd6bfa",
  "nodeNumber": "0030",
  "docId": "112",
  "sourceFile": "Hansen et al (2020) - JOH.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "An adaptive large neighborhood search heuristic for the planar storage location assignment problem: application to stowage planning for Roll-on Roll-off ships",
  "authors": [
   "Jone R. Hansen",
   "Kjetil Fagerholt",
   "Magnus Stålhane",
   "Jørgen G. Rakke"
  ],
  "publicationDate": "2020-08-14",
  "venue": "Journal of Heuristics",
  "doi": "10.1007/s10732-020-09451-z",
  "keywords": [
   "maritime transportation",
   "packing",
   "stowage",
   "roll-on/roll-off",
   "roro",
   "heuristics"
  ],
  "teaser": "This paper considers a generalized version of the planar storage location problem arising in the stowage planning for Roll-on/Roll-off ships. A ship is set to sail along a predefined voyage where given cargoes are to be"
 },
 {
  "id": "an-effective-methodology-for-dynamic-3d-facial-expression-d32ae8",
  "nodeNumber": "0031",
  "docId": "19",
  "sourceFile": "10.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "An effective methodology for dynamic 3D facial expression retrieval",
  "authors": [
   "Antonios Danelakis",
   "Theoharis Theoharis",
   "Ioannis Pratikakis",
   "Panagiotis Perakis"
  ],
  "publicationDate": "2016-01",
  "venue": "Pattern Recognition",
  "doi": "10.1016/j.patcog.2015.10.012",
  "keywords": [
   "dynamic 3d mesh sequence",
   "4d facial expression retrieval",
   "4d facial expression recognition",
   "3d object retrieval",
   "facial landmarks",
   "dynamic time warping"
  ],
  "teaser": "The problem of facial expression recognition in dynamic sequences of 3D face scans has received a significant amount of attention in the recent past whereas the problem of retrieval in this type of data has not. A novel"
 },
 {
  "id": "an-efficient-screening-technique-for-acceptable-mental-e73354",
  "nodeNumber": "0032",
  "docId": "148",
  "sourceFile": "Braarud-2020-An efficient screening technique for acceptable mental workload.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "An efficient screening technique for acceptable mental workload based on the NASA Task Load Index—development and application to control room validation",
  "authors": [
   "Per Øivind Braarud"
  ],
  "publicationDate": "2020-01-26",
  "venue": "International Journal of Industrial Ergonomics",
  "doi": "10.1016/j.ergon.2019.102904",
  "keywords": [
   "mental workload",
   "nasa task load index",
   "control room validation",
   "human factors",
   "acceptability rating",
   "ergonomics"
  ],
  "teaser": "Workload assessment is required for human factors validation of control rooms. The NASA Task Load Index (TLX) is a popular measure for this purpose. However, acceptability of workload is difficult to interpret based on"
 },
 {
  "id": "an-improved-formulation-for-the-inventory-routing-problem-e88583",
  "nodeNumber": "0033",
  "docId": "116",
  "sourceFile": "Skålnes et al (2022) - EJOR.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "An improved formulation for the inventory routing problem with time-varying demands",
  "authors": [
   "Jørgen Skålnes",
   "Henrik Andersson",
   "Guy Desaulniers",
   "Magnus Stålhane"
  ],
  "publicationDate": "2022-02-09",
  "venue": "European Journal of Operational Research",
  "doi": "10.1016/j.ejor.2022.02.011",
  "keywords": [
   "routing",
   "inventory routing",
   "branch-and-cut",
   "dantzig-wolfe reformulation",
   "valid inequalities"
  ],
  "teaser": "The Inventory Routing Problem (IRP) is a broad class of complex routing problems where the quantities of delivered products must also be determined. In this paper, we consider the classic IRP where a single supplier"
 },
 {
  "id": "an-incentivized-auction-based-group-selling-approach-for-f23b61",
  "nodeNumber": "0034",
  "docId": "168",
  "sourceFile": "03_An_Incentivez_Auction.pdf",
  "researcher": "Sabita Maharjan",
  "title": "An Incentivized Auction-Based Group-Selling Approach for Demand Response Management in V2G Systems",
  "authors": [
   "Ming Zeng",
   "Supeng Leng",
   "Sabita Maharjan",
   "Stein Gjessing",
   "Jianhua He"
  ],
  "publicationDate": "2015-12",
  "venue": "IEEE Transactions on Industrial Informatics",
  "doi": "10.1109/TII.2015.2482948",
  "keywords": [
   "auction",
   "demand response management",
   "group-selling",
   "vehicle-to-grid",
   "v2g",
   "smart grid"
  ],
  "teaser": "Vehicle-to-grid (V2G) system with efficient demand response management (DRM) is critical to solve the problem of supplying electricity by utilizing surplus electricity available at electric vehicles (EVs). An"
 },
 {
  "id": "an-information-theory-based-locational-marginal-pricing-85e7e0",
  "nodeNumber": "0035",
  "docId": "173",
  "sourceFile": "08_An_Information_Theory-Based_Locational_Marginal_Pricing_Solution_for_Low-Carbon_Power_Systems.pdf",
  "researcher": "Sabita Maharjan",
  "title": "An Information Theory-Based Locational Marginal Pricing Solution for Low-Carbon Power Systems",
  "authors": [
   "Ziming Liu",
   "Bonan Huang",
   "Pengbo Du",
   "Qiuye Sun",
   "Sabita Maharjan",
   "David Wenzhong Gao",
   "Yushuai Li"
  ],
  "publicationDate": "2024-12",
  "venue": "IEEE Transactions on Industrial Informatics",
  "doi": "10.1109/TII.2024.3413363",
  "keywords": [
   "information theory",
   "locational marginal pricing",
   "low-carbon power systems",
   "security-constrained economic dispatch",
   "uncertainty",
   "renewable energy"
  ],
  "teaser": "The transition of the power system into a low-carbon power system (LCPS) with a high penetration of renewable energy resources addresses several issues related to energy and climate. However, due to the uncertainty"
 },
 {
  "id": "an-investigation-of-speech-features-plant-system-alarms-and-c378f7",
  "nodeNumber": "0036",
  "docId": "151",
  "sourceFile": "Braarud-et-al-2020-AI-Classification of Operator Cognitive Workload During Dynamic Work.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "An Investigation of Speech Features, Plant System Alarms, and Operator–System Interaction for the Classification of Operator Cognitive Workload During Dynamic Work",
  "authors": [
   "Per Øivind Braarud",
   "Terje Bodal",
   "John E. Hulsund",
   "Michael N. Louka",
   "Christer Nihlwing",
   "Espen Nystad",
   "Håkan Svengren",
   "Emil Wingstedt"
  ],
  "publicationDate": "2021-08",
  "venue": "Human Factors",
  "doi": "10.1177/0018720820961730",
  "keywords": [
   "cognitive workload",
   "dynamic measurement",
   "nonintrusive",
   "machine learning",
   "simulator research",
   "human factors"
  ],
  "teaser": "Objective: To investigate speech features, human–machine alarms, and operator–system interaction for the estimation of cognitive workload in full-scale realistic simulated scenarios. Background: Theories and models of"
 },
 {
  "id": "analysis-of-full-scale-riser-responses-in-field-conditions-eae721",
  "nodeNumber": "0037",
  "docId": "264",
  "sourceFile": "Wu_etal_2022.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Analysis of full-scale riser responses in field conditions based on Gaussian mixture model",
  "authors": [
   "Jie Wu",
   "Sølve Eidnes",
   "Jingzhe Jin",
   "Halvor Lie",
   "Decao Yin",
   "Elizabeth Passano",
   "Svein Sævik",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2022-12-21",
  "venue": "Journal of Fluids and Structures",
  "doi": "10.1016/j.jfluidstructs.2022.103793",
  "keywords": [
   "marine riser",
   "field measurement",
   "vortex-induced vibrations",
   "gaussian mixture model",
   "unsupervised learning",
   "time domain analysis"
  ],
  "teaser": "Offshore slender marine structures experience complex and combined load conditions from waves, current and vessel motions that may result in both wave frequency and vortex shedding response patterns. Field measurements"
 },
 {
  "id": "analyzing-the-factors-affecting-storage-space-management-at-e742d6",
  "nodeNumber": "0038",
  "docId": "98",
  "sourceFile": "Strandhagen et al. (2025) Analyzing the factors affecting storage space management at offshore construction yards.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Analyzing the Factors Affecting Storage Space Management at Offshore Construction Yards: Insights from a Single Case Study",
  "authors": [
   "Jo Wessel Strandhagen",
   "Ottar Bakås",
   "Sven-Vegard Buer"
  ],
  "publicationDate": "2026",
  "venue": "IFIP International Federation for Information Processing (APMS 2025, IFIP AICT 767)",
  "doi": "10.1007/978-3-032-03542-4_28",
  "keywords": [
   "storage",
   "yard logistics",
   "offshore construction",
   "engineer-to-order",
   "material handling",
   "inventory management"
  ],
  "teaser": "Offshore construction yards are under pressure to improve cost-efficiency and productivity, as they transition from oil and gas projects to new renewable energy markets such as offshore wind. These emerging markets are"
 },
 {
  "id": "application-of-machine-learning-to-the-identification-of-96ddce",
  "nodeNumber": "0039",
  "docId": "76",
  "sourceFile": "Application_of_machine_learning_to_the_identificat.pdf",
  "researcher": "Ivan_Depina",
  "title": "Application of machine learning to the identification of quick and highly sensitive clays from cone penetration tests",
  "authors": [
   "Cristian Godoy",
   "Ivan Depina",
   "Vikas Thakur"
  ],
  "publicationDate": "2020-06",
  "venue": "Journal of Zhejiang University-SCIENCE A (Applied Physics & Engineering)",
  "doi": "10.1631/jzus.A1900556",
  "keywords": [
   "machine learning",
   "classification",
   "quick clays",
   "sensitive clays",
   "cptu",
   "geotechnical"
  ],
  "teaser": "Geotechnical classification is vital for site characterization and geotechnical design. Field tests such as the cone penetration test with pore water pressure measurement (CPTu) are widespread because they represent a"
 },
 {
  "id": "application-of-physics-informed-neural-networks-to-inverse-18e242",
  "nodeNumber": "0040",
  "docId": "77",
  "sourceFile": "Application_of_physics-informed_neural_networks_to.pdf",
  "researcher": "Ivan_Depina",
  "title": "Application of physics-informed neural networks to inverse problems in unsaturated groundwater flow",
  "authors": [
   "Ivan Depina",
   "Saket Jain",
   "Sigurdur Mar Valsson",
   "Hrvoje Gotovac"
  ],
  "publicationDate": "2021-09-30",
  "venue": "Georisk: Assessment and Management of Risk for Engineered Systems and Geohazards",
  "doi": "10.1080/17499518.2021.1971251",
  "keywords": [
   "physics-informed neural networks",
   "richards equation",
   "unsaturated groundwater flow",
   "inverse problems",
   "van genuchten model",
   "hydraulic conductivity"
  ],
  "teaser": "This paper investigates the application of Physics-Informed Neural Networks (PINNs) to inverse problems in unsaturated groundwater flow. PINNs are applied to the types of unsaturated groundwater flow problems modelled"
 },
 {
  "id": "artificial-intelligence-and-business-value-a-literature-f73f59",
  "nodeNumber": "0041",
  "docId": "140",
  "sourceFile": "2.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Artificial Intelligence and Business Value: a Literature Review",
  "authors": [
   "Ida Merete Enholm",
   "Emmanouil Papagiannidis",
   "Patrick Mikalef",
   "John Krogstie"
  ],
  "publicationDate": "2021-08-25",
  "venue": "Information Systems Frontiers",
  "doi": "10.1007/s10796-021-10186-w",
  "keywords": [
   "artificial intelligence",
   "systematic literature review",
   "research agenda",
   "business value",
   "ai adoption",
   "organizational change"
  ],
  "teaser": "Artificial Intelligence (AI) is a wide-ranging set of technologies that promise several advantages for organizations in terms of added business value. Over the past few years, organizations are increasingly turning to"
 },
 {
  "id": "artificial-intelligence-capabilities-for-circular-business-1e3187",
  "nodeNumber": "0042",
  "docId": "146",
  "sourceFile": "8.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Artificial intelligence capabilities for circular business models: Research synthesis and future agenda",
  "authors": [
   "Arun Madanaguli",
   "David Sjödin",
   "Vinit Parida",
   "Patrick Mikalef"
  ],
  "publicationDate": "2024-01-11",
  "venue": "Technological Forecasting & Social Change",
  "doi": "10.1016/j.techfore.2023.123189",
  "keywords": [
   "artificial intelligence",
   "circular business models",
   "business model innovation",
   "capabilities",
   "sustainability",
   "literature review"
  ],
  "teaser": "This study explores the interlink between AI capabilities and circular business models (CBMs) through a literature review. Extant literature reveals that AI can act as efficiency catalyst, empowering firms to implement"
 },
 {
  "id": "asap-attention-based-state-space-abstraction-for-policy-8e85cd",
  "nodeNumber": "0043",
  "docId": "60",
  "sourceFile": "6.pdf",
  "researcher": "Helge_Langseth",
  "title": "ASAP: Attention-Based State Space Abstraction for Policy Summarization",
  "authors": [
   "Yanzhe Bekkemoen",
   "Helge Langseth"
  ],
  "publicationDate": "2023",
  "venue": "Proceedings of Machine Learning Research, ACML 2023",
  "doi": null,
  "keywords": [
   "explainable reinforcement learning",
   "deep learning",
   "interpretability",
   "state space abstraction",
   "attention maps",
   "policy summarization"
  ],
  "teaser": "Deep reinforcement learning (RL) has shown remarkable performance, but end-users do not understand how the system solves tasks due to the black-box nature of neural networks. Many methods from explainable machine"
 },
 {
  "id": "assembly-line-design-for-industrialized-electrolyser-46eb98",
  "nodeNumber": "0044",
  "docId": "244",
  "sourceFile": "Buer et al - Assembly line design for industrialized electrolyser production.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "Assembly Line Design for Industrialized Electrolyser Production",
  "authors": [
   "Sven-Vegard Buer",
   "Lars Skjelstad"
  ],
  "publicationDate": "2024",
  "venue": "IFIP International Federation for Information Processing (APMS 2024)",
  "doi": "10.1007/978-3-031-71645-4_5",
  "keywords": [
   "factory planning",
   "electrolyser stack assembly",
   "flow efficiency",
   "modelling",
   "simulation",
   "industrialization"
  ],
  "teaser": "The electrolyser industry is under rapid development, where manufacturing companies seek opportunities to develop industrialized solutions for electrolyser production. However, electrolyser production implies major"
 },
 {
  "id": "assessment-of-tso-dso-coordination-to-enhance-flexible-grid-585e64",
  "nodeNumber": "0045",
  "docId": "214",
  "sourceFile": "s40518-025-00269-6.pdf",
  "researcher": "Sebastien Gros",
  "title": "Assessment of TSO-DSO Coordination to Enhance Flexible Grid Operation",
  "authors": [
   "Younes Zahraoui",
   "Basanta Raj Pokhrel",
   "Irina Oleinikova",
   "Sebastien Nicolas Gros"
  ],
  "publicationDate": "2025-06-28",
  "venue": "Current Sustainable/Renewable Energy Reports",
  "doi": "10.1007/s40518-025-00269-6",
  "keywords": [
   "congestion management",
   "voltage control",
   "flexibility",
   "grid operation",
   "tso-dso coordination",
   "renewable energy"
  ],
  "teaser": "The growing penetration of renewable energy sources (RES) and distributed energy resources (DERs) has introduced new challenges in power system stability, voltage regulation, and congestion management. Therefore,"
 },
 {
  "id": "asymptotic-stability-of-perturbation-based-extremum-seeking-dc6131",
  "nodeNumber": "0046",
  "docId": "126",
  "sourceFile": "Asymptotic_Stability_of_Perturbation-Based_Extremum-Seeking_Control_for_Nonlinear_Plants.pdf",
  "researcher": "Mark_Haring",
  "title": "Asymptotic Stability of Perturbation-Based Extremum-Seeking Control for Nonlinear Plants",
  "authors": [
   "Mark Haring",
   "Tor Arne Johansen"
  ],
  "publicationDate": "2017-05",
  "venue": "IEEE Transactions on Automatic Control",
  "doi": "10.1109/TAC.2016.2603607",
  "keywords": [
   "asymptotic stability",
   "extremum-seeking control",
   "performance optimization",
   "nonlinear systems",
   "time-varying tuning",
   "adaptive control"
  ],
  "teaser": "We introduce a perturbation-based extremum-seeking controller for general nonlinear dynamical plants with an arbitrary number of tunable plant parameters. The controller ensures asymptotic convergence of the plant"
 },
 {
  "id": "automated-3d-burr-detection-in-cast-manufacturing-using-5d9d8e",
  "nodeNumber": "0047",
  "docId": "3",
  "sourceFile": "04.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "Automated 3D burr detection in cast manufacturing using sparse convolutional neural networks",
  "authors": [
   "Ahmed Mohammed",
   "Johannes Kvam",
   "Ingrid Fjordheim Onstein",
   "Marianne Bakken",
   "Helene Schulerud"
  ],
  "publicationDate": "2022-10-11",
  "venue": "Journal of Intelligent Manufacturing",
  "doi": "10.1007/s10845-022-02036-6",
  "keywords": [
   "burr detection",
   "burr height",
   "deep learning",
   "convolutional neural network",
   "registration",
   "cast manufacturing"
  ],
  "teaser": "For automating deburring of cast parts, this paper proposes a general method for estimating burr height using 3D vision sensor that is robust to missing data in the scans and sensor noise. Specifically, we present a"
 },
 {
  "id": "balancing-explainability-accuracy-of-complex-models-b7a8e8",
  "nodeNumber": "0048",
  "docId": "175",
  "sourceFile": "10_Balancing Explainability-Accuracy of Complex Models_2305.14098v1.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Balancing Explainability-Accuracy of Complex Models",
  "authors": [
   "Poushali Sengupta",
   "Yan Zhang",
   "Sabita Maharjan",
   "Frank Eliassen"
  ],
  "publicationDate": "2023-05",
  "venue": null,
  "doi": "10.48550/arXiv.2305.14098",
  "keywords": [
   "explainable ai",
   "machine learning",
   "neural networks",
   "deep learning",
   "feature importance",
   "uncertainty quantification"
  ],
  "teaser": "Explainability of AI models is an important topic that can have a significant impact in all domains and applications from autonomous driving to healthcare. The existing approaches to explainable AI (XAI) are mainly"
 },
 {
  "id": "balancing-the-norwegian-regulated-power-market-anno-2016-to-312ed6",
  "nodeNumber": "0049",
  "docId": "228",
  "sourceFile": "2402.09134v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Balancing the Norwegian regulated power market anno 2016 to 2022",
  "authors": [
   "Pål Forr Austnes",
   "Signe Riemer-Sørensen",
   "David Andreas Bordvik",
   "Christian Andre Andresen"
  ],
  "publicationDate": "2024-02-15",
  "venue": "Preprint submitted to Elsevier",
  "doi": null,
  "keywords": [
   "balancing power market",
   "balancing electricity demand and production",
   "regulation volume",
   "regulation price",
   "time correlations",
   "norwegian power market"
  ],
  "teaser": "The balancing market for power is designed to account for the difference between predicted supply/demand of electricity and the realised supply/demand. However, increased electrification of society changes the"
 },
 {
  "id": "balancing-the-norwegian-regulated-power-market-anno-2016-to-40e55e",
  "nodeNumber": "0050",
  "docId": "32",
  "sourceFile": "1.pdf",
  "researcher": "Christian_Andresen",
  "title": "Balancing the Norwegian regulated power market anno 2016 to 2022",
  "authors": [
   "Pål Forr Austnes",
   "Signe Riemer-Sørensen",
   "David Andreas Bordvik",
   "Christian Andre Andresen"
  ],
  "publicationDate": "2024-02-14",
  "venue": "Energy Strategy Reviews",
  "doi": "10.1016/j.esr.2024.101331",
  "keywords": [
   "balancing power market",
   "balancing electricity demand and production",
   "regulation volume",
   "regulation price",
   "time correlations",
   "norwegian power market"
  ],
  "teaser": "The balancing market for power is designed to account for the difference between predicted supply/demand of electricity and the realised supply/demand. However, increased electrification of society changes the"
 },
 {
  "id": "barriers-and-drivers-for-implementation-of-automatic-fault-56268a",
  "nodeNumber": "0051",
  "docId": "82",
  "sourceFile": "1-s2.0-S0378778823010319-main.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Barriers and drivers for implementation of automatic fault detection and diagnosis in buildings and HVAC systems: An outlook from industry experts",
  "authors": [
   "Kamilla Heimar Andersen",
   "Simon Pommerencke Melgaard",
   "Hicham Johra",
   "Anna Marszal-Pomianowska",
   "Rasmus Lund Jensen",
   "Per Kvols Heiselberg"
  ],
  "publicationDate": "2024-01-15",
  "venue": "Energy & Buildings",
  "doi": "10.1016/j.enbuild.2023.113801",
  "keywords": [
   "fault detection and diagnosis",
   "hvac systems",
   "building automation",
   "energy efficiency",
   "industry barriers",
   "qualitative interviews"
  ],
  "teaser": "This study aimed to assess the current status of Fault Detection and Diagnosis (FDD) implementation in building Automated Fault Detection and Diagnosis and Heating, Ventilation and Air Conditioning (HVAC) systems in the"
 },
 {
  "id": "bayesian-exploration-in-deep-reinforcement-learning-bf65e3",
  "nodeNumber": "0052",
  "docId": "58",
  "sourceFile": "4.pdf",
  "researcher": "Helge_Langseth",
  "title": "Bayesian Exploration in Deep Reinforcement Learning",
  "authors": [
   "Ludvig Killingberg",
   "Helge Langseth"
  ],
  "publicationDate": "2023-06-14",
  "venue": "NAIS 2023: The 2023 symposium of the Norwegian AI Society",
  "doi": null,
  "keywords": [
   "bayesian deep learning",
   "reinforcement learning",
   "exploration",
   "posterior sampling",
   "variational inference",
   "q-learning"
  ],
  "teaser": "Posterior sampling of value functions can give efficient exploration for value-based reinforcement learning algorithms. We introduce BayesianExplore (BE), a posterior sampling-based method for reinforcement learning"
 },
 {
  "id": "behavioral-indicators-an-approach-for-assessing-control-8cebe8",
  "nodeNumber": "0053",
  "docId": "154",
  "sourceFile": "Braarud-Pignoni-2023-Behavioural-indicators-Excessive Cognitive Workload-AHFE-proceedings.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "Behavioral Indicators – An Approach for Assessing Control Room Operators’ Excessive Cognitive Workload?",
  "authors": [
   "Per Øivind Braarud",
   "Giovanni Pignoni"
  ],
  "publicationDate": "2023",
  "venue": "AHFE Open Access",
  "doi": "10.54941/ahfe1003565",
  "keywords": [
   "cognitive workload",
   "excessive cognitive workload",
   "behavioral indicators",
   "control room operators",
   "workload redline",
   "human factors"
  ],
  "teaser": "Cognitive workload that deteriorates the control room team’s performance is a central topic for human-technology design and evaluation. However, while stated as an essential research topic, the literature provides few"
 },
 {
  "id": "beyond-climate-anxiety-development-and-validation-of-the-68f862",
  "nodeNumber": "0054",
  "docId": "28",
  "sourceFile": "1-s2.0-S0959378023001309-main.pdf",
  "researcher": "Christian Klöckner",
  "title": "Beyond climate anxiety: Development and validation of the inventory of climate emotions (ICE): A measure of multiple emotions experienced in relation to climate change",
  "authors": [
   "Michalina Marczak",
   "Małgorzata Wierzba",
   "Dominika Zaremba",
   "Maria Kulesza",
   "Jan Szczypiński",
   "Bartosz Kossowski",
   "Magdalena Budziszewska",
   "Jarosław M. Michałowski",
   "Christian A. Klöckner",
   "Artur Marchewka"
  ],
  "publicationDate": "2023-10-06",
  "venue": "Global Environmental Change",
  "doi": "10.1016/j.gloenvcha.2023.102764",
  "keywords": [
   "climate change",
   "climate emotions",
   "climate anxiety",
   "questionnaire",
   "psychometrics",
   "pro-climate behaviour"
  ],
  "teaser": "There is a growing research interest in the affective aspects of climate change and their links with pro-climate engagement. Yet, psychometrically valid instruments assessing the wide panorama of emotional responses to"
 },
 {
  "id": "building-dynamic-capabilities-by-leveraging-big-data-160422",
  "nodeNumber": "0055",
  "docId": "143",
  "sourceFile": "5.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Building dynamic capabilities by leveraging big data analytics: The role of organizational inertia",
  "authors": [
   "Patrick Mikalef",
   "Rogier van de Wetering",
   "John Krogstie"
  ],
  "publicationDate": "2021-01",
  "venue": "Information & Management",
  "doi": "10.1016/j.im.2020.103412",
  "keywords": [
   "big data analytics",
   "organizational transformation",
   "inertia",
   "dynamic capabilities",
   "multiple case study",
   "it-enabled transformation"
  ],
  "teaser": "Although big data analytics have been claimed to revolutionize the way firms operate and do business, there is a striking lack of knowledge about how organizations should adopt and routinize such technologies to support"
 },
 {
  "id": "calculating-bayesian-model-evidence-for-porous-media-flow-600839",
  "nodeNumber": "0056",
  "docId": "106",
  "sourceFile": "1_s20_S0021999124004583_main.pdf",
  "researcher": "Kristian_Fossum",
  "title": "Calculating Bayesian model evidence for porous-media flow using a multilevel estimator",
  "authors": [
   "Trond Mannseth",
   "Kristian Fossum",
   "Sigurd I. Aanonsen"
  ],
  "publicationDate": "2024-06-20",
  "venue": "Journal of Computational Physics",
  "doi": "10.1016/j.jcp.2024.113209",
  "keywords": [
   "porous-media flow",
   "uncertainty quantification",
   "model selection",
   "model averaging",
   "model stacking",
   "multilevel simulations"
  ],
  "teaser": "We consider calculation of the Bayesian model evidence, which is an essential component in realistic uncertainty quantification. The main motivation is large-scale porous-media-flow problems, where plain Monte-Carlo"
 },
 {
  "id": "can-ai-abuse-personal-information-in-an-ev-fast-charging-9b8361",
  "nodeNumber": "0057",
  "docId": "202",
  "sourceFile": "Can_AI_Abuse_Personal_Information_in_an_EV_Fast-Charging_Market.pdf",
  "researcher": "Sebastien Gros",
  "title": "Can AI Abuse Personal Information in an EV Fast-Charging Market?",
  "authors": [
   "Sangjun Bae",
   "Sébastien Gros",
   "Balázs Kulcsár"
  ],
  "publicationDate": "2022-07",
  "venue": "IEEE Transactions on Intelligent Transportation Systems",
  "doi": "10.1109/TITS.2021.3086006",
  "keywords": [
   "electric vehicle",
   "fast-charging station",
   "information abuse",
   "personalized dynamic pricing",
   "reinforcement learning",
   "markov decision process"
  ],
  "teaser": "In order to alleviate the range anxiety of electric vehicle users (EVUs), several researches focus on facilitating the efficiency of fast-electric vehicle charging stations (fast-EVCSs) using artificial intelligence"
 },
 {
  "id": "challenges-and-opportunities-for-digital-twin-modelling-and-01e039",
  "nodeNumber": "0058",
  "docId": "253",
  "sourceFile": "Sperre et al - Challenges and opportunities for digital twin modelling and optimization in yard operations.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "Challenges and Opportunities for Digital Twin Modelling and Optimization in Yard Operations",
  "authors": [
   "Linda Helen Sperre",
   "Giuseppe Fragapane",
   "Zachari Thiry",
   "Logan Reed Vallandingham",
   "Pål Furu Kamsvåg",
   "Jo Wessel Strandhagen",
   "Sven-Vegard Buer"
  ],
  "publicationDate": "2026",
  "venue": "IFIP International Federation for Information Processing (APMS 2025)",
  "doi": "10.1007/978-3-032-03542-4_27",
  "keywords": [
   "yard operations",
   "engineer-to-order",
   "digital twin",
   "artificial intelligence",
   "optimization"
  ],
  "teaser": "Norwegian yards face difficulties in operational coordination and the adoption of effective technical solutions, reducing their overall productivity. To remain competitive and fully leverage the vast amount of data, it"
 },
 {
  "id": "closing-the-sim2real-performance-gap-in-rl-936a59",
  "nodeNumber": "0059",
  "docId": "16",
  "sourceFile": "Sim_to_real RL.pdf",
  "researcher": "Akhil S Anand",
  "title": "Closing the Sim2Real Performance Gap in RL",
  "authors": [
   "Akhil S Anand",
   "Shambhuraj Sawant",
   "Jasper Hoffmann",
   "Dirk Reinhardt",
   "Sebastien Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "sim2real",
   "reinforcement learning",
   "bilevel optimization",
   "simulation",
   "policy transfer",
   "model-based rl"
  ],
  "teaser": "Sim2Real aims at training policies in high-fidelity simulation environments and effectively transferring them to the real world. Despite the developments of accurate simulators and Sim2Real RL approaches, the policies"
 },
 {
  "id": "clustering-and-dimensionality-reduction-techniques-applied-3162a0",
  "nodeNumber": "0060",
  "docId": "40",
  "sourceFile": "6.pdf",
  "researcher": "Christian_Andresen",
  "title": "Clustering and Dimensionality-reduction Techniques Applied on Power Quality Measurement Data",
  "authors": [
   "Gjert H. Rosenlund",
   "Kristian W. Hoiem",
   "Bendik N. Tørsæter",
   "Christian A. Andresen"
  ],
  "publicationDate": "2020",
  "venue": "IEEE",
  "doi": "10.1109/PECon.2020.9302901",
  "keywords": [
   "machine learning",
   "unsupervised learning",
   "power system",
   "power quality analysis",
   "fault prediction",
   "dimensionality reduction"
  ],
  "teaser": "The power system is changing rapidly, and new tools for predicting unwanted events are needed to keep a high level of security of supply. Large volumes of data from the Norwegian power grid have been collected over"
 },
 {
  "id": "combining-hybrid-genetic-search-with-ruin-and-recreate-for-35ece9",
  "nodeNumber": "0061",
  "docId": "115",
  "sourceFile": "Simensen et al (2022) - JoH.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "Combining hybrid genetic search with ruin-and-recreate for solving the capacitated vehicle routing problem",
  "authors": [
   "Martin Simensen",
   "Geir Hasle",
   "Magnus Stålhane"
  ],
  "publicationDate": "2022-10-15",
  "venue": "Journal of Heuristics",
  "doi": "10.1007/s10732-022-09500-9",
  "keywords": [
   "vehicle routing problems",
   "hybrid metaheuristics",
   "evolutionary algorithms",
   "local search",
   "large neighborhood search",
   "capacitated vehicle routing problem"
  ],
  "teaser": "The Capacitated Vehicle Routing Problem (CVRP) has been subject to intense research efforts for more than sixty years. Yet, significant algorithmic improvements are still being made. The most competitive heuristic"
 },
 {
  "id": "combining-physics-based-and-data-driven-techniques-for-ee799b",
  "nodeNumber": "0062",
  "docId": "269",
  "sourceFile": "Blakseth2022cpb.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Combining physics-based and data-driven techniques for reliable hybrid analysis and modeling using the corrective source term approach",
  "authors": [
   "Sindre Stenen Blakseth",
   "Adil Rasheed",
   "Trond Kvamsdal",
   "Omer San"
  ],
  "publicationDate": "2022-08-19",
  "venue": "Applied Soft Computing",
  "doi": "10.1016/j.asoc.2022.109533",
  "keywords": [
   "deep neural networks",
   "reliable hybrid analysis and modeling",
   "physics-based modeling",
   "data-driven modeling",
   "digital twins",
   "partial differential equations"
  ],
  "teaser": "Upcoming technologies like digital twins, autonomous, and artificial intelligent systems involving safety–critical applications require accurate, interpretable, computationally efficient, and generalizable models."
 },
 {
  "id": "combining-system-identification-with-reinforcement-learning-2b8b78",
  "nodeNumber": "0063",
  "docId": "186",
  "sourceFile": "2004.03265v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Combining system identification with reinforcement learning-based MPC",
  "authors": [
   "Andreas B. Martinsen",
   "Anastasios M. Lekkas",
   "Sébastien Gros"
  ],
  "publicationDate": "2020",
  "venue": null,
  "doi": "10.48550/arXiv.2004.03265",
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "system identification",
   "data-driven control",
   "q-learning",
   "prediction error method"
  ],
  "teaser": "In this paper we propose and compare methods for combining system identification (SYSID) and reinforcement learning (RL) in the context of data-driven model predictive control (MPC). Assuming a known model structure of"
 },
 {
  "id": "comparative-study-of-event-prediction-in-power-grids-using-8e6eda",
  "nodeNumber": "0064",
  "docId": "42",
  "sourceFile": "8.pdf",
  "researcher": "Christian_Andresen",
  "title": "Comparative Study of Event Prediction in Power Grids using Supervised Machine Learning Methods",
  "authors": [
   "Kristian Wang Høiem",
   "Vemund Santi",
   "Bendik Nybakk Torsæter",
   "Helge Langseth",
   "Christian André Andresen",
   "Gjert H. Rosenlund"
  ],
  "publicationDate": "2020",
  "venue": "IEEE",
  "doi": "10.1109/ISGT-Europe47291.2020.9248785",
  "keywords": [
   "machine learning",
   "power systems",
   "power quality",
   "fault prediction",
   "random forest",
   "event prediction"
  ],
  "teaser": "There is a growing interest in applying machine learning methods on large amounts of data to solve complex problems, such as prediction of events and disturbances in the power system. This paper is a comparative study"
 },
 {
  "id": "comparing-control-room-operators-and-experts-assessment-of-3384e9",
  "nodeNumber": "0065",
  "docId": "149",
  "sourceFile": "Braarud-2021-control room operators and experts assessment of team performance.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "Comparing control room operators’ and experts’ assessment of team performance using structured task-specific observation protocols and scenario replay",
  "authors": [
   "Per Øivind Braarud"
  ],
  "publicationDate": "2021-07-05",
  "venue": "Applied Ergonomics",
  "doi": "10.1016/j.apergo.2021.103500",
  "keywords": [
   "self-assessment",
   "expert assessment",
   "assessment method",
   "team performance",
   "nuclear control room",
   "ergonomics"
  ],
  "teaser": "Operators’ self-assessment has received limited interest within process control or human-system evaluation. Research on self-assessment has been criticised for poor assessment methodology, and consequently, its status"
 },
 {
  "id": "comparison-of-two-different-types-of-reduced-graph-based-7d5ade",
  "nodeNumber": "0066",
  "docId": "99",
  "sourceFile": "1-s2.0-S0920410522011184-main.pdf",
  "researcher": "Knut-Andreas Lie",
  "title": "Comparison of two different types of reduced graph-based reservoir models: Interwell networks (GPSNet) versus aggregated coarse-grid networks (CGNet)",
  "authors": [
   "Knut-Andreas Lie",
   "Stein Krogstad"
  ],
  "publicationDate": "2022-12-14",
  "venue": "Journal of Petroleum Science and Engineering",
  "doi": "10.1016/j.petrol.2022.111266",
  "keywords": [
   "graph-based models",
   "reduced-order models",
   "reservoir simulation",
   "network models",
   "grid coarsening",
   "adjoints"
  ],
  "teaser": "Computerized solutions for field management optimization often require reduced-order models to be computationally tractable. The purpose of this paper is to compare two different graph-based approaches for building such"
 },
 {
  "id": "computationally-efficient-gauss-newton-reinforcement-4c7485",
  "nodeNumber": "0067",
  "docId": "197",
  "sourceFile": "2508.02441v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Computationally efficient Gauss-Newton reinforcement learning for model predictive control",
  "authors": [
   "Dean Brandner",
   "Sebastien Gros",
   "Sergio Lucia"
  ],
  "publicationDate": null,
  "venue": "Preprint submitted to Elsevier",
  "doi": null,
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "gauss-newton optimization",
   "process control",
   "policy optimization",
   "data efficiency"
  ],
  "teaser": "Model predictive control (MPC) is widely used in process control due to its interpretability and ability to handle constraints. As a parametric policy in reinforcement learning (RL), MPC offers strong initial"
 },
 {
  "id": "constraints-on-the-presence-of-a-3-5-kev-dark-matter-48aadd",
  "nodeNumber": "0068",
  "docId": "217",
  "sourceFile": "1405.7943v3.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Constraints on the presence of a 3.5 keV dark matter emission line from Chandra observations of the Galactic centre",
  "authors": [
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2021-11-08",
  "venue": "Astronomy & Astrophysics",
  "doi": null,
  "keywords": [
   "dark matter",
   "x-rays",
   "galaxy center",
   "line identification",
   "chandra",
   "astrophysics"
  ],
  "teaser": "Context. Recent findings of line emission at 3.5 keV in both individual and stacked X-ray spectra of galaxy clusters have been speculated to have dark matter origin. Aims. If the origin is indeed dark matter, the"
 },
 {
  "id": "consumer-side-fairness-in-recommender-systems-a-systematic-768846",
  "nodeNumber": "0069",
  "docId": "62",
  "sourceFile": "8.pdf",
  "researcher": "Helge_Langseth",
  "title": "Consumer-side fairness in recommender systems: a systematic survey of methods and evaluation",
  "authors": [
   "Bjørnar Vassøy",
   "Helge Langseth"
  ],
  "publicationDate": "2024-03-29",
  "venue": "Artificial Intelligence Review",
  "doi": "10.1007/s10462-023-10663-5",
  "keywords": [
   "recommender systems",
   "fairness",
   "survey",
   "consumer-side fairness",
   "bias",
   "taxonomy"
  ],
  "teaser": "In the current landscape of ever-increasing levels of digitalization, we are facing major challenges pertaining to data volume. Recommender systems have become irreplaceable both for helping users navigate the"
 },
 {
  "id": "context-driven-edge-based-data-sharing-for-industrial-iot-bf161b",
  "nodeNumber": "0070",
  "docId": "158",
  "sourceFile": "Context-driven Edge-based Data Sharing for Industrial IoT Data.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Context-driven Edge-based Data Sharing for Industrial IoT Data Spaces",
  "authors": [
   "An Ngoc Lam",
   "Phu H. Nguyen",
   "Xiang Ma"
  ],
  "publicationDate": "2025-03-31",
  "venue": "The 40th ACM/SIGAPP Symposium on Applied Computing (SAC '25)",
  "doi": "10.1145/3672608.3707988",
  "keywords": [
   "access control policies",
   "context-aware data sharing",
   "data spaces",
   "digital twins",
   "manufacturing as a service",
   "edge computing"
  ],
  "teaser": "The Industrial Internet of Things (IIoT) extends IoT technologies into industrial production environments, enabling automation, predictive maintenance, and operational efficiency. As these ecosystems expand, they"
 },
 {
  "id": "convex-neural-network-based-cost-modifications-for-learning-040894",
  "nodeNumber": "0071",
  "docId": "203",
  "sourceFile": "Convex_Neural_Network-Based_Cost_Modifications_for_Learning_Model_Predictive_Control.pdf",
  "researcher": "Sebastien Gros",
  "title": "Convex Neural Network-Based Cost Modifications for Learning Model Predictive Control",
  "authors": [
   "Katrine Seel",
   "Arash Bahari Kordabadi",
   "Sébastien Gros",
   "Jan Tommy Gravdahl"
  ],
  "publicationDate": "2022-11-10",
  "venue": "IEEE Open Journal of the Control Systems Society",
  "doi": "10.1109/OJCSYS.2022.3221063",
  "keywords": [
   "model predictive control",
   "neural networks",
   "reinforcement learning",
   "convex optimization",
   "economic mpc",
   "dissipativity"
  ],
  "teaser": "Developing model predictive control (MPC) schemes can be challenging for systems where an accurate model is not available, or too costly to develop. With the increasing availability of data and tools to treat them,"
 },
 {
  "id": "corl-reinforcement-learning-of-milp-policies-solved-via-b067eb",
  "nodeNumber": "0072",
  "docId": "14",
  "sourceFile": "RL_for_combinatorial_decisions.pdf",
  "researcher": "Akhil S Anand",
  "title": "CORL: Reinforcement Learning of MILP Policies Solved via Branch-and-Bound",
  "authors": [
   "Akhil S Anand",
   "Elias Årekolb",
   "Martin Mziray Dalseg",
   "Magnus Stålhane",
   "Sebastien Gros"
  ],
  "publicationDate": null,
  "venue": "CORL",
  "doi": null,
  "keywords": [
   "reinforcement learning",
   "mixed-integer linear programming",
   "branch-and-bound",
   "combinatorial optimization",
   "decision-focused learning",
   "policy gradient"
  ],
  "teaser": "Combinatorial sequential decision-making problems are typically modeled as mixed-integer linear programs (MILPs) and solved via branch-and-bound (B&B) algorithms. The inherent difficulty of modeling MILPs that"
 },
 {
  "id": "cross-time-registration-of-3d-point-clouds-f238e7",
  "nodeNumber": "0073",
  "docId": "24",
  "sourceFile": "6.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "Cross-time registration of 3D point clouds",
  "authors": [
   "Evdokia Saiti",
   "Antonios Danelakis",
   "Theoharis Theoharis"
  ],
  "publicationDate": "2021-07-09",
  "venue": "Computers & Graphics",
  "doi": "10.1016/j.cag.2021.07.005",
  "keywords": [
   "3d registration",
   "alignment",
   "cross-time",
   "retrieval",
   "cultural heritage",
   "erosion"
  ],
  "teaser": "Registration is a ubiquitous operation in visual computing and constitutes an important pre-processing step for operations such as 3D object reconstruction, retrieval and recognition. Particularly in cultural heritage"
 },
 {
  "id": "data-driven-distributionally-robust-control-for-interacting-417536",
  "nodeNumber": "0074",
  "docId": "194",
  "sourceFile": "2503.09816v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Data-Driven Distributionally Robust Control for Interacting Agents under Logical Constraints",
  "authors": [
   "Arash Bahari Kordabad",
   "Eleftherios E. Vlahakis",
   "Lars Lindemann",
   "Sebastien Gros",
   "Dimos V. Dimarogonas",
   "Sadegh Soudjani"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "data-driven control",
   "interacting agents",
   "signal temporal logic",
   "chance-constrained program",
   "distributionally robust optimization",
   "concentration of measure"
  ],
  "teaser": "In this paper, we propose a distributionally robust control synthesis for an agent with stochastic dynamics that interacts with other agents under uncertainties and constraints expressed by signal temporal logic (STL)."
 },
 {
  "id": "data-driven-economic-nmpc-using-reinforcement-learning-aa5c1e",
  "nodeNumber": "0075",
  "docId": "182",
  "sourceFile": "1904.04152v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Data-driven Economic NMPC using Reinforcement Learning",
  "authors": [
   "Sébastien Gros",
   "Mario Zanon"
  ],
  "publicationDate": "2019-04-15",
  "venue": null,
  "doi": "10.48550/arXiv.1904.04152",
  "keywords": [
   "reinforcement learning",
   "economic nmpc",
   "nonlinear model predictive control",
   "dissipativity",
   "optimal control",
   "function approximation"
  ],
  "teaser": "Reinforcement Learning (RL) is a powerful tool to perform data-driven optimal control without relying on a model of the system. However, RL struggles to provide hard guarantees on the behavior of the resulting control"
 },
 {
  "id": "data-driven-modelling-with-coarse-grid-network-models-68e8fa",
  "nodeNumber": "0076",
  "docId": "103",
  "sourceFile": "s10596-023-10237-y.pdf",
  "researcher": "Knut-Andreas Lie",
  "title": "Data-driven modelling with coarse-grid network models",
  "authors": [
   "Knut-Andreas Lie",
   "Stein Krogstad"
  ],
  "publicationDate": "2023-08-04",
  "venue": "Computational Geosciences",
  "doi": "10.1007/s10596-023-10237-y",
  "keywords": [
   "data-driven models",
   "model calibration",
   "interwell network models",
   "reservoir simulation",
   "coarse-grid models",
   "flow modeling"
  ],
  "teaser": "We propose to use a conventional simulator, formulated on the topology of a coarse volumetric 3D grid, as a data-driven network model that seeks to reproduce observed and predict future well responses. The conceptual"
 },
 {
  "id": "data-driven-predictive-control-and-mpc-do-we-achieve-9081a1",
  "nodeNumber": "0077",
  "docId": "10",
  "sourceFile": "data_driven_control.pdf",
  "researcher": "Akhil S Anand",
  "title": "Data-Driven Predictive Control and MPC: Do we achieve optimality?",
  "authors": [
   "A.S. Anand",
   "S. Sawant",
   "D. Reinhardt",
   "S. Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "predictive control",
   "model predictive control",
   "data-driven control",
   "optimality",
   "sequential decision-making",
   "stochastic systems"
  ],
  "teaser": "In this paper, we explore the interplay between Predictive Control and closed-loop optimality, spanning from Model Predictive Control to Data-Driven Predictive Control. Predictive Control in general relies on some form"
 },
 {
  "id": "data-driven-predictive-control-and-mpc-do-we-achieve-aa79c8",
  "nodeNumber": "0078",
  "docId": "191",
  "sourceFile": "2405.17892v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Data-Driven Predictive Control and MPC: Do we achieve optimality?",
  "authors": [
   "A.S. Anand",
   "S. Sawant",
   "D. Reinhardt",
   "S. Gros"
  ],
  "publicationDate": "2024-05",
  "venue": null,
  "doi": "10.48550/arXiv.2405.17892",
  "keywords": [
   "predictive control",
   "model predictive control",
   "data-driven control",
   "optimality",
   "markov decision processes",
   "sequential decision-making"
  ],
  "teaser": "In this paper, we explore the interplay between Predictive Control and closed-loop optimality, spanning from Model Predictive Control to Data-Driven Predictive Control. Predictive Control in general relies on some form"
 },
 {
  "id": "data-sharing-privacy-and-security-considerations-in-the-8c1e49",
  "nodeNumber": "0079",
  "docId": "174",
  "sourceFile": "09_Regulatory_review_paper_20250305_arXiv_2503.03539v1.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Data Sharing, Privacy and Security Considerations in the Energy Sector: A Review from Technical Landscape to Regulatory Specifications",
  "authors": [
   "Shiliang Zhang",
   "Sabita Maharjan",
   "Lee Andrew Bygrave",
   "Shui Yu"
  ],
  "publicationDate": "2025-03-05",
  "venue": "arXiv",
  "doi": "10.48550/arXiv.2503.03539",
  "keywords": [
   "data sharing",
   "privacy",
   "cyber security",
   "energy system",
   "regulation",
   "compliance"
  ],
  "teaser": "Decarbonization, decentralization and digitalization are the three key elements driving the twin energy transition. The energy system is evolving to a more data driven, intelligent and advanced ecosystem, leading to the"
 },
 {
  "id": "day-ahead-scheduling-and-real-time-economic-mpc-of-chp-unit-de573c",
  "nodeNumber": "0080",
  "docId": "199",
  "sourceFile": "252313.pdf",
  "researcher": "Sebastien Gros",
  "title": "Day-Ahead Scheduling and Real-Time Economic MPC of CHP Unit in Microgrid With Smart Buildings",
  "authors": [
   "Josip Vasilj",
   "Sebastien Gros",
   "Damir Jakus",
   "Mario Zanon"
  ],
  "publicationDate": "2019-03",
  "venue": "IEEE Transactions on Smart Grid",
  "doi": "10.1109/TSG.2017.2785500",
  "keywords": [
   "microgrid",
   "day-ahead scheduling",
   "economic mpc",
   "smart buildings",
   "stochastic programming",
   "chp"
  ],
  "teaser": "This paper presents a model for day-ahead scheduling of the combined heat and electric energy production for a residential microgrid taking into account the economic factors in a liberalized electricity market, the"
 },
 {
  "id": "deep-learning-for-prediction-of-complex-geology-ahead-of-9356fa",
  "nodeNumber": "0081",
  "docId": "108",
  "sourceFile": "2104.02550v1.pdf",
  "researcher": "Kristian_Fossum",
  "title": "Deep learning for prediction of complex geology ahead of drilling",
  "authors": [
   "Kristian Fossum",
   "Sergey Alyaev",
   "Jan Tveranger",
   "Ahmed Elsheikh"
  ],
  "publicationDate": "2021",
  "venue": null,
  "doi": "10.1007/s11004-021-09960-0",
  "keywords": [
   "geosteering",
   "machine learning",
   "deep neural network",
   "generative adversarial network",
   "ensemble randomized maximum likelihood",
   "electromagnetic logging"
  ],
  "teaser": "During a geosteering operation the well path is intentionally adjusted in response to the new data acquired while drilling. To achieve consistent high-quality decisions, especially when drilling in complex environments,"
 },
 {
  "id": "deep-neural-network-enabled-corrective-source-term-approach-8368ea",
  "nodeNumber": "0082",
  "docId": "270",
  "sourceFile": "Blakseth2022dnn.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Deep neural network enabled corrective source term approach to hybrid analysis and modeling",
  "authors": [
   "Sindre Stenen Blakseth",
   "Adil Rasheed",
   "Trond Kvamsdal",
   "Omer San"
  ],
  "publicationDate": "2022-01",
  "venue": "Neural Networks",
  "doi": "10.1016/j.neunet.2021.11.021",
  "keywords": [
   "deep neural networks",
   "digital twins",
   "explainable ai",
   "hybrid analysis and modeling",
   "physics-based modeling",
   "corrective source term approach"
  ],
  "teaser": "In this work, we introduce, justify and demonstrate the Corrective Source Term Approach (CoSTA)—a novel approach to Hybrid Analysis and Modeling (HAM). The objective of HAM is to combine physics-based modeling (PBM) and"
 },
 {
  "id": "deep-reinforcement-learning-for-economic-dispatch-of-7713cf",
  "nodeNumber": "0083",
  "docId": "170",
  "sourceFile": "05_Deep_Reinforcement_Learning_for_Economic_Dispatch_of_Virtual_Power_Plant_in_Internet_of_Energy.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Deep Reinforcement Learning for Economic Dispatch of Virtual Power Plant in Internet of Energy",
  "authors": [
   "Lin Lin",
   "Xin Guan",
   "Sabita Maharjan",
   "Tomoaki Ohtsuki",
   "Yu Peng",
   "Ning Wang"
  ],
  "publicationDate": "2020-07",
  "venue": "IEEE Internet of Things Journal",
  "doi": "10.1109/JIOT.2020.2966232",
  "keywords": [
   "deep reinforcement learning",
   "economic dispatch",
   "virtual power plants",
   "edge computing",
   "distributed generation",
   "internet of energy"
  ],
  "teaser": "With the high penetration of large-scale distributed renewable energy generation, the power system is facing enormous challenges in terms of the inherent uncertainty of power generation of renewable energy resources. In"
 },
 {
  "id": "deep-reinforcement-learning-for-long-term-hydropower-23ef99",
  "nodeNumber": "0084",
  "docId": "218",
  "sourceFile": "2012.06312v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Deep Reinforcement Learning for Long Term Hydropower Production Scheduling",
  "authors": [
   "Signe Riemer-Sørensen",
   "Gjert H. Rosenlund"
  ],
  "publicationDate": "2020",
  "venue": "IEEE",
  "doi": "10.1109/ACCESS.2020.3040123",
  "keywords": [
   "deep reinforcement learning",
   "hydropower scheduling",
   "soft actor-critic",
   "energy systems",
   "optimization",
   "stochastic control"
  ],
  "teaser": "We explore the use of deep reinforcement learning to provide strategies for long term scheduling of hydropower production. We consider a use-case where the aim is to optimise the yearly revenue given week-by-week"
 },
 {
  "id": "demand-response-management-in-the-smart-grid-in-a-large-84bb58",
  "nodeNumber": "0085",
  "docId": "167",
  "sourceFile": "02_Demand_Response_Management_in_the_Smart_Grid_in_a_Large_Population_Regime.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Demand Response Management in the Smart Grid in a Large Population Regime",
  "authors": [
   "Sabita Maharjan",
   "Quanyan Zhu",
   "Yan Zhang",
   "Stein Gjessing",
   "Tamer Başar"
  ],
  "publicationDate": "2016-01",
  "venue": "IEEE Transactions on Smart Grid",
  "doi": "10.1109/TSG.2015.2431324",
  "keywords": [
   "consumer welfare",
   "demand response management",
   "large population",
   "profit optimization",
   "stackelberg game",
   "smart grid"
  ],
  "teaser": "In this paper, we introduce a hierarchical system model that captures the decision making processes involved in a network of multiple providers and a large number of consumers in the smart grid, incorporating multiple"
 },
 {
  "id": "dependable-demand-response-management-in-the-smart-grid-a-a7f397",
  "nodeNumber": "0086",
  "docId": "166",
  "sourceFile": "01_Dependable_DRM.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Dependable Demand Response Management in the Smart Grid: A Stackelberg Game Approach",
  "authors": [
   "Sabita Maharjan",
   "Quanyan Zhu",
   "Yan Zhang",
   "Stein Gjessing",
   "Tamer Başar"
  ],
  "publicationDate": "2013-03",
  "venue": "IEEE Transactions on Smart Grid",
  "doi": "10.1109/TSG.2012.2223766",
  "keywords": [
   "demand response management",
   "smart grid",
   "stackelberg game",
   "reliability",
   "security",
   "dependability"
  ],
  "teaser": "Demand Response Management (DRM) is a key component in the smart grid to effectively reduce power generation costs and user bills. However, it has been an open issue to address the DRM problem in a network of multiple"
 },
 {
  "id": "derivative-free-discrete-gradient-methods-0e3078",
  "nodeNumber": "0087",
  "docId": "262",
  "sourceFile": "Myhr and Eidnes - Derivative-free discrete gradient methods.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "DERIVATIVE-FREE DISCRETE GRADIENT METHODS",
  "authors": [
   "Håkon Nøren Myhr",
   "Sølve Eidnes"
  ],
  "publicationDate": "2023-08-15",
  "venue": "Journal of Computational Dynamics",
  "doi": "10.3934/jcd.2024004",
  "keywords": [
   "discrete gradient methods",
   "numerical integration",
   "hamiltonian systems",
   "derivative-free methods",
   "finite differences",
   "order theory"
  ],
  "teaser": "Discrete gradient methods are a class of numerical integrators producing solutions with exact preservation of first integrals of ordinary differential equations. In this paper, we apply order theory combined with the"
 },
 {
  "id": "developing-multi-agent-llm-applications-through-continuous-cb0a1b",
  "nodeNumber": "0088",
  "docId": "162",
  "sourceFile": "Model_based_LLM_Agents-6.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Developing Multi-Agent LLM Applications through Continuous Human-LLM Co-Programming",
  "authors": [
   "Hui Song",
   "Arda Goknil",
   "Xiaojun Jiang",
   "Espen Melum",
   "Hyunwhan Joe",
   "Caterina Gazzotti",
   "Valerio Frascolla",
   "Adela Nedisan Videsjorden",
   "Phu Nguyen"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "multi-agent systems",
   "large language models",
   "software engineering",
   "co-programming",
   "model-based development",
   "llm agents"
  ],
  "teaser": "The rapid advancement of Large Language Models (LLMs) has opened new possibilities for intelligent multi-agent systems capable of autonomously performing complex tasks. To build such multi-agent systems, developers can"
 },
 {
  "id": "diagnosing-migraine-from-genome-wide-genotype-data-a-a4a466",
  "nodeNumber": "0089",
  "docId": "20",
  "sourceFile": "2.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "Diagnosing migraine from genome-wide genotype data: a machine learning analysis",
  "authors": [
   "Antonios Danelakis",
   "Tjaša Kumelj",
   "Bendik S. Winsvold",
   "Marte Helene Bjørk",
   "Parashkev Nachev",
   "Manjit Matharu",
   "Dominic Giles",
   "International Headache Genetic Consortium",
   "Erling Tronvik",
   "Helge Langseth",
   "Anker Stubberud"
  ],
  "publicationDate": "2025",
  "venue": "Brain",
  "doi": null,
  "keywords": [
   "artificial intelligence",
   "gradient boosting",
   "headache",
   "genetics",
   "epistasis",
   "hunt"
  ],
  "teaser": "Migraine has an assumed polygenic basis, but the genetic risk variants identified in genome-wide association studies only explain a proportion of the heritability. We aimed to develop machine learning models, capturing"
 },
 {
  "id": "differentiable-nonlinear-model-predictive-control-41d81d",
  "nodeNumber": "0090",
  "docId": "195",
  "sourceFile": "2505.01353v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Differentiable Nonlinear Model Predictive Control",
  "authors": [
   "Jonathan Frey",
   "Katrin Baumgärtner",
   "Gianluca Frison",
   "Dirk Reinhardt",
   "Jasper Hoffmann",
   "Leonard Fichtner",
   "Sébastien Gros",
   "Moritz Diehl"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "nonlinear model predictive control",
   "parametric solution sensitivities",
   "implicit function theorem",
   "interior-point methods",
   "sequential quadratic programming",
   "acados"
  ],
  "teaser": "The efficient computation of parametric solution sensitivities is a key challenge in the integration of learning-enhanced methods with nonlinear model predictive control (MPC), as their availability is crucial for many"
 },
 {
  "id": "digital-roadmap-methodology-for-small-and-medium-sized-df46a5",
  "nodeNumber": "0091",
  "docId": "252",
  "sourceFile": "Lund et al - Digital roadmap methodology for small and medium-sized manufacturing companies.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "Digital Roadmap Methodology for Small and Medium-Sized Manufacturing Companies",
  "authors": [
   "Håkon Lund",
   "Sven-Vegard Buer",
   "Lars Skjelstad"
  ],
  "publicationDate": "2023",
  "venue": "CARV 2023, LNME",
  "doi": "10.1007/978-3-031-34821-1_76",
  "keywords": [
   "digitalization",
   "roadmap",
   "industry 4.0",
   "bottom-up approach",
   "smes",
   "manufacturing"
  ],
  "teaser": "The digital transition enabled by Industry 4.0 challenges companies’ capacity to identify, select, and implement incremental and holistic improvement possibilities. The numerous possibilities fueled by digital"
 },
 {
  "id": "digital-twin-values-challenges-and-enablers-from-a-modeling-96339d",
  "nodeNumber": "0092",
  "docId": "275",
  "sourceFile": "Rasheed2020dtv.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Digital Twin: Values, Challenges and Enablers From a Modeling Perspective",
  "authors": [
   "Adil Rasheed",
   "Omer San",
   "Trond Kvamsdal"
  ],
  "publicationDate": "2020-01-28",
  "venue": "IEEE Access",
  "doi": "10.1109/ACCESS.2020.2970143",
  "keywords": [
   "digital twin",
   "artificial intelligence",
   "machine learning",
   "big data cybernetics",
   "hybrid analysis",
   "modeling"
  ],
  "teaser": "Digital twin can be defined as a virtual representation of a physical asset enabled through data and simulators for real-time prediction, optimization, monitoring, controlling, and improved decision making. Recent"
 },
 {
  "id": "digital-twins-in-wind-energy-emerging-technologies-and-ceb6b6",
  "nodeNumber": "0093",
  "docId": "277",
  "sourceFile": "Stadtmann2023dti.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Digital Twins in Wind Energy: Emerging Technologies and Industry-Informed Future Directions",
  "authors": [
   "Florian Stadtmann",
   "Adil Rasheed",
   "Trond Kvamsdal",
   "Kjetil André Johannessen",
   "Omer San",
   "Konstanze Kölle",
   "John Olav Tande",
   "Idar Barstad",
   "Alexis Benhamou",
   "Thomas Brathaug",
   "Tore Christiansen",
   "Anouk-Letizia Firle",
   "Alexander Fjeldly",
   "Lars Frøyd",
   "Alexander Gleim",
   "Alexander Høiberget",
   "Catherine Meissner",
   "Guttorm Nygård",
   "Jørgen Olsen",
   "Håvard Paulshus",
   "Tore Rasmussen",
   "Elling Rishoff",
   "Francesco Scibilia",
   "John Olav Skogås"
  ],
  "publicationDate": "2023-10-02",
  "venue": "IEEE Access",
  "doi": "10.1109/ACCESS.2023.3321320",
  "keywords": [
   "digital twin",
   "wind energy",
   "machine learning",
   "artificial intelligence",
   "hybrid modeling",
   "industry"
  ],
  "teaser": "This article presents a comprehensive overview of the digital twin technology and its capability levels, with a specific focus on its applications in the wind energy industry. It consolidates the definitions of digital"
 },
 {
  "id": "digitalization-and-sustainable-manufacturing-twin-269c12",
  "nodeNumber": "0094",
  "docId": "1",
  "sourceFile": "02.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "Digitalization and Sustainable Manufacturing: Twin Transition in Norway",
  "authors": [
   "Sverre Gulbrandsen-Dahl",
   "Halvor Holtskog",
   "Heidi C. Dreyer",
   "Einar L. Hinrichsen",
   "Gabor Sziebig",
   "Håkon Raabe",
   "Kristian Martinsen"
  ],
  "publicationDate": "2025",
  "venue": "Routledge",
  "doi": "10.4324/9781032693415",
  "keywords": [
   "digitalization",
   "sustainable manufacturing",
   "industry 4.0",
   "automation",
   "digital twins",
   "norway"
  ],
  "teaser": "The manufacturing industry is facing massive changes driven by digitalization and sustainability. It is being redefined to meet the UN SDGs with the creation of new materials, processes and machinery. The drive for"
 },
 {
  "id": "digitalized-manufacturing-logistics-in-engineer-to-order-139a43",
  "nodeNumber": "0095",
  "docId": "93",
  "sourceFile": "Strandhagen et al. (2019) Digitalized Manufacturing Logistics in Engineer-to-Order Operations.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Digitalized Manufacturing Logistics in Engineer-to-Order Operations",
  "authors": [
   "Jo Wessel Strandhagen",
   "Sven-Vegard Buer",
   "Marco Semini",
   "Erlend Alfnes"
  ],
  "publicationDate": "2019",
  "venue": "IFIP International Federation for Information Processing (APMS 2019)",
  "doi": "10.1007/978-3-030-30000-5_71",
  "keywords": [
   "engineer-to-order",
   "digitalization",
   "manufacturing logistics",
   "industry 4.0",
   "case study",
   "shipbuilding"
  ],
  "teaser": "The high complexity in Engineer-To-Order (ETO) operations causes major challenges for manufacturing logistics, especially in complex ETO, i.e. one-of-a-kind production. Increased digitalization of manufacturing"
 },
 {
  "id": "distinguish-workflow-a-new-paradigm-of-dynamic-well-1d6930",
  "nodeNumber": "0096",
  "docId": "109",
  "sourceFile": "alyaev2024(2025)distinguish-arxiv-edition.pdf",
  "researcher": "Kristian_Fossum",
  "title": "DISTINGUISH Workflow: A New Paradigm of Dynamic Well Placement Using Generative Machine Learning",
  "authors": [
   "Sergey Alyaev",
   "Kristian Fossum",
   "Hibat Errahmen Djecta",
   "Jan Tveranger",
   "Ahmed H. Elsheikh"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "geosteering",
   "generative adversarial networks",
   "dynamic programming",
   "well placement",
   "real-time drilling",
   "machine learning"
  ],
  "teaser": "The real-time process of directional changes while drilling, known as geosteering, is crucial for hydrocarbon extraction and emerging directional drilling applications such as geothermal energy, civil infrastructure,"
 },
 {
  "id": "distributed-deep-reinforcement-learning-for-intelligent-7b040c",
  "nodeNumber": "0097",
  "docId": "171",
  "sourceFile": "06_Distributed_Deep_Reinforcement_Learning_for_Intelligent_Load_Scheduling_in_Residential_Smart_Grids.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Distributed Deep Reinforcement Learning for Intelligent Load Scheduling in Residential Smart Grids",
  "authors": [
   "Hwei-Ming Chung",
   "Sabita Maharjan",
   "Yan Zhang",
   "Frank Eliassen"
  ],
  "publicationDate": "2021-04",
  "venue": "IEEE Transactions on Industrial Informatics",
  "doi": "10.1109/TII.2020.3007167",
  "keywords": [
   "deep reinforcement learning",
   "privacy",
   "real-time pricing",
   "smart grid",
   "stochastic game",
   "load scheduling"
  ],
  "teaser": "The power consumption of households has been constantly growing over the years. To cope with this growth, intelligent management of the consumption profile of the households is necessary, such that the households can"
 },
 {
  "id": "divide-and-conquer-for-causal-computation-ec610f",
  "nodeNumber": "0098",
  "docId": "55",
  "sourceFile": "10.pdf",
  "researcher": "Helge_Langseth",
  "title": "Divide and conquer for causal computation",
  "authors": [
   "Anna Rodum Bjørud",
   "Rafael Cabañas",
   "Helge Langseth",
   "Antonio Salmerón"
  ],
  "publicationDate": "2025-07-05",
  "venue": "International Journal of Approximate Reasoning",
  "doi": "10.1016/j.ijar.2025.109520",
  "keywords": [
   "structural causal models",
   "causality",
   "counterfactual reasoning",
   "satisfiability",
   "heuristic search",
   "divide-and-conquer"
  ],
  "teaser": "Structural causal models are a powerful framework for causal and counterfactual inference, extending the capabilities of traditional Bayesian networks. These models comprise endogenous and exogenous variables, where the"
 },
 {
  "id": "don-lstm-multi-resolution-learning-with-deeponets-and-long-6fc3fa",
  "nodeNumber": "0099",
  "docId": "227",
  "sourceFile": "2310.02491v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "DON-LSTM: Multi-Resolution Learning with DeepONets and Long Short-Term Memory Neural Networks",
  "authors": [
   "Katarzyna Michałowska",
   "Somdatta Goswami",
   "George Em Karniadakis",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2023-10",
  "venue": null,
  "doi": "10.48550/arXiv.2310.02491",
  "keywords": [
   "deep learning",
   "neural operators",
   "multi-resolution learning",
   "lstm",
   "dynamical systems",
   "pde"
  ],
  "teaser": "Deep operator networks (DeepONets, DONs) offer a distinct advantage over traditional neural networks in their ability to be trained on multi-resolution data. This property becomes especially relevant in real-world"
 },
 {
  "id": "effective-descriptors-for-human-action-retrieval-from-3d-e1feae",
  "nodeNumber": "0100",
  "docId": "25",
  "sourceFile": "8.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "Effective Descriptors for Human Action Retrieval from 3D Mesh Sequences",
  "authors": [
   "Christos Veinidis",
   "Antonios Danelakis",
   "Ioannis Pratikakis",
   "Theoharis Theoharis"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "3d mesh sequence",
   "action retrieval",
   "3d shape representation",
   "3d shape descriptors",
   "matching"
  ],
  "teaser": "Two novel methods for fully unsupervised human action retrieval using 3D mesh sequences are presented. The first achieves high accuracy but is suitable for sequences consisting of clean meshes, such as artificial"
 },
 {
  "id": "enabling-ai-capabilities-in-government-agencies-a-study-of-581980",
  "nodeNumber": "0101",
  "docId": "145",
  "sourceFile": "7.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Enabling AI capabilities in government agencies: A study of determinants for European municipalities",
  "authors": [
   "Patrick Mikalef",
   "Kristina Lemmer",
   "Cindy Schaefer",
   "Maija Ylinen",
   "Siw Olsen Fjørtoft",
   "Hans Yngvar Torvatn",
   "Manjul Gupta",
   "Bjoern Niehaves"
  ],
  "publicationDate": "2022",
  "venue": "Government Information Quarterly",
  "doi": "10.1016/j.giq.2021.101596",
  "keywords": [
   "artificial intelligence",
   "public sector",
   "ai capabilities",
   "toe framework",
   "municipalities",
   "digital transformation"
  ],
  "teaser": "Artificial Intelligence (AI) is gradually becoming an integral part of the digital strategy of organizations. Yet, the use of AI in public organizations is still lagging significantly compared to private organizations."
 },
 {
  "id": "enabling-localized-peer-to-peer-electricity-trading-among-f3673f",
  "nodeNumber": "0102",
  "docId": "169",
  "sourceFile": "04_Enabling_Localized_Peer-to-Peer_Electricity_Trading_Among_Plug-in_Hybrid_Electric_Vehicles_Using_Consortium_Blockchains.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Enabling Localized Peer-to-Peer Electricity Trading Among Plug-in Hybrid Electric Vehicles Using Consortium Blockchains",
  "authors": [
   "Jiawen Kang",
   "Rong Yu",
   "Xumin Huang",
   "Sabita Maharjan",
   "Yan Zhang",
   "Ekram Hossain"
  ],
  "publicationDate": "2017-12",
  "venue": "IEEE Transactions on Industrial Informatics",
  "doi": "10.1109/TII.2017.2709784",
  "keywords": [
   "consortium blockchain",
   "decentralized energy trading",
   "double auction",
   "plug-in hybrid electric vehicles",
   "security",
   "privacy"
  ],
  "teaser": "We propose a localized peer-to-peer (P2P) electricity trading model for locally buying and selling electricity among plug-in hybrid electric vehicles (PHEVs) in smart grids. Unlike traditional schemes, which transport"
 },
 {
  "id": "energy-management-in-residential-microgrid-using-model-1002ee",
  "nodeNumber": "0103",
  "docId": "178",
  "sourceFile": "1-s2.0-S0952197622007837-main.pdf",
  "researcher": "Sebastien Gros",
  "title": "Energy management in residential microgrid using model predictive control-based reinforcement learning and Shapley value",
  "authors": [
   "Wenqi Cai",
   "Arash Bahari Kordabad",
   "Sébastien Gros"
  ],
  "publicationDate": "2023-01-06",
  "venue": "Engineering Applications of Artificial Intelligence",
  "doi": "10.1016/j.engappai.2022.105793",
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "microgrid",
   "energy management",
   "shapley value",
   "cooperative coalition game"
  ],
  "teaser": "This paper presents an Energy Management (EM) strategy for residential microgrid systems using Model Predictive Control (MPC)-based Reinforcement Learning (RL) and Shapley value. We construct a typical residential"
 },
 {
  "id": "energy-preserving-methods-on-riemannian-manifolds-1f966b",
  "nodeNumber": "0104",
  "docId": "263",
  "sourceFile": "S0025-5718-2019-03470-1.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "ENERGY-PRESERVING METHODS ON RIEMANNIAN MANIFOLDS",
  "authors": [
   "Elena Celledoni",
   "Sølve Eidnes",
   "Brynjulf Owren",
   "Torbjørn Ringholm"
  ],
  "publicationDate": "2020-03",
  "venue": "Mathematics of Computation",
  "doi": "10.1090/mcom/3470",
  "keywords": [
   "geometric integration",
   "discrete gradients",
   "riemannian manifolds",
   "numerical analysis",
   "energy preservation",
   "lie groups"
  ],
  "teaser": "The energy-preserving discrete gradient methods are generalized to finite-dimensional Riemannian manifolds by definition of a discrete approximation to the Riemannian gradient, a retraction, and a coordinate center"
 },
 {
  "id": "enhancing-elasticity-models-with-deep-learning-a-novel-19e41f",
  "nodeNumber": "0105",
  "docId": "279",
  "sourceFile": "Sørbø2024eem.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Enhancing elasticity models with deep learning: A novel corrective source term approach for accurate predictions",
  "authors": [
   "Sondre Sørbø",
   "Sindre Stenen Blakseth",
   "Adil Rasheed",
   "Trond Kvamsdal",
   "Omer San"
  ],
  "publicationDate": "2024-01-30",
  "venue": "Applied Soft Computing",
  "doi": "10.1016/j.asoc.2024.111312",
  "keywords": [
   "deep neural networks",
   "hybrid analysis and modeling",
   "corrective source term approach",
   "predictive modeling",
   "partial differential equations"
  ],
  "teaser": "With the recent wave of digitalization, specifically in the context of safety–critical applications, there has been a growing need for computationally efficient, accurate, generalizable, and trustworthy models."
 },
 {
  "id": "enhancing-iiot-with-data-quality-as-a-service-a-framework-22250b",
  "nodeNumber": "0106",
  "docId": "159",
  "sourceFile": "Enhancing IIoT with Data Quality as a Service-A Framework for Reliable Analytics.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Enhancing IIoT with Data Quality as a Service: A Framework for Reliable Analytics",
  "authors": [
   "Arda Goknil",
   "Phu Nguyen",
   "Erik Johannes Husom",
   "Sagar Sen",
   "Simeon Tverdal",
   "Flavien Peysson",
   "Dimitra Politaki",
   "Roberto González-Velázquez"
  ],
  "publicationDate": "2025-01",
  "venue": "ACM",
  "doi": "10.1145/nnnnnnn.nnnnnnn",
  "keywords": [
   "iiot",
   "data quality",
   "machine learning",
   "data integrity",
   "framework",
   "analytics"
  ],
  "teaser": "The Industrial Internet of Things (IIoT) represents a convergence of digital technologies and industrial processes, enabling unprecedented levels of efficiency, productivity, and automation. As these systems become"
 },
 {
  "id": "enhancing-software-safety-through-programming-languages-a-fa2280",
  "nodeNumber": "0107",
  "docId": "266",
  "sourceFile": "esrel2025-fullpaper-RUST programme language vD1RG.pdf",
  "researcher": "Thor Myklebust",
  "title": "Enhancing Software Safety Through Programming Languages: A Study of Rust",
  "authors": [
   "Thor Myklebust",
   "Christian Askeland",
   "Espen Helle"
  ],
  "publicationDate": "2025",
  "venue": "Proceedings of the 35th European Safety and Reliability and the 33rd Society for Risk Analysis Europe Conference",
  "doi": "10.3850/981-973-0000-00-0",
  "keywords": [
   "rust",
   "safety",
   "c",
   "c++",
   "programming language",
   "iec 61508"
  ],
  "teaser": "Ensuring software safety has become a paramount concern in modern software development, with the choice of programming language playing a crucial role. This paper investigates the role of Rust, a systems programming"
 },
 {
  "id": "ensemble-history-matching-workflow-using-interpretable-2677aa",
  "nodeNumber": "0108",
  "docId": "110",
  "sourceFile": "fb2024014.pdf",
  "researcher": "Kristian_Fossum",
  "title": "Ensemble history-matching workflow using interpretable SPADE-GAN geomodel",
  "authors": [
   "Kristian Fossum",
   "Sergey Alyaev",
   "Ahmed H. Elsheikh"
  ],
  "publicationDate": "2024-02",
  "venue": "First Break",
  "doi": "10.3997/1365-2397.fb2024014",
  "keywords": [
   "history matching",
   "spade-gan",
   "geomodelling",
   "machine learning",
   "reservoir simulation",
   "geostatistics"
  ],
  "teaser": "Ensemble history matching adjusts multiple geomodels used for reservoir simulation, conditioning them to historical data. It reduces and quantifies the uncertainty in the unknown model parameters to increase the models’"
 },
 {
  "id": "entropic-risk-based-predictive-control-for-wind-integrated-9b75e1",
  "nodeNumber": "0109",
  "docId": "204",
  "sourceFile": "Entropic_Risk-Based_Predictive_Control_for_Wind_Integrated_Energy_Systems_Under_Market_Participation.pdf",
  "researcher": "Sebastien Gros",
  "title": "Entropic Risk-Based Predictive Control for Wind Integrated Energy Systems Under Market Participation",
  "authors": [
   "Kang Qiu",
   "Sébastien Gros",
   "Lars Struen Imsland"
  ],
  "publicationDate": "2025-08-25",
  "venue": "2025 IEEE Conference on Control Technology and Applications (CCTA)",
  "doi": null,
  "keywords": [
   "predictive control",
   "renewable energy",
   "risk management",
   "energy markets",
   "wind power",
   "stochastic optimization"
  ],
  "teaser": "Energy systems with a significant share of renewable energy production require control strategies that can handle the effects of uncertainty to ensure stable and reliable operation. Simultaneously, liberalized energy"
 },
 {
  "id": "estimation-of-future-power-consumption-for-uavs-4870ec",
  "nodeNumber": "0110",
  "docId": "130",
  "sourceFile": "Fossøy_EstimationOfFuturePowerConsumptionForUAVs2025.pdf",
  "researcher": "Mark_Haring",
  "title": "Estimation of Future Power Consumption for UAVs",
  "authors": [
   "Synne Fossøy",
   "Mark Haring",
   "Aleksander Simonsen",
   "Esten Ingar Grøtli"
  ],
  "publicationDate": "2025-06-22",
  "venue": "2025 IEEE Intelligent Vehicles Symposium (IV)",
  "doi": null,
  "keywords": [
   "uav",
   "power consumption",
   "energy estimation",
   "quadcopter",
   "wind estimation",
   "physics-based model"
  ],
  "teaser": "In drone missions, accurate estimation of remaining flight time is crucial for enhancing mission duration and reducing the risk of losing drones due to power outages. This paper addresses the challenge of predicting"
 },
 {
  "id": "estimation-of-future-power-consumption-for-uavs-ff34c5",
  "nodeNumber": "0111",
  "docId": "47",
  "sourceFile": "Fossøy_EstimationOfFuturePowerConsumptionForUAVs2025.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Estimation of Future Power Consumption for UAVs",
  "authors": [
   "Synne Fossøy",
   "Mark Haring",
   "Aleksander Simonsen",
   "Esten Ingar Grøtli"
  ],
  "publicationDate": "2025-06-22",
  "venue": "2025 IEEE Intelligent Vehicles Symposium (IV)",
  "doi": null,
  "keywords": [
   "uav",
   "power consumption",
   "energy estimation",
   "quadcopter",
   "wind estimation",
   "physics-based modeling"
  ],
  "teaser": "In drone missions, accurate estimation of remaining flight time is crucial for enhancing mission duration and reducing the risk of losing drones due to power outages. This paper addresses the challenge of predicting"
 },
 {
  "id": "evaluating-clinical-diversity-and-plausibility-of-synthetic-d8c9ee",
  "nodeNumber": "0112",
  "docId": "6",
  "sourceFile": "07.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "Evaluating clinical diversity and plausibility of synthetic capsule endoscopic images",
  "authors": [
   "Anuja Vats",
   "Marius Pedersen",
   "Ahmed Mohammed",
   "Øistein Hovde"
  ],
  "publicationDate": "2023",
  "venue": "Scientific Reports",
  "doi": "10.1038/s41598-023-36883-x",
  "keywords": [
   "capsule endoscopy",
   "synthetic images",
   "deep learning",
   "stylegan",
   "medical imaging",
   "gastroenterology"
  ],
  "teaser": "Wireless Capsule Endoscopy (WCE) is being increasingly used as an alternative imaging modality for complete and non-invasive screening of the gastrointestinal tract. Although this is advantageous in reducing unnecessary"
 },
 {
  "id": "evaluating-passing-ability-in-association-football-af7164",
  "nodeNumber": "0113",
  "docId": "113",
  "sourceFile": "Håland et al (2020) - IMAJMM.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "Evaluating passing ability in association football",
  "authors": [
   "Else Marie Håland",
   "Astrid Salte Wiig",
   "Magnus Stålhane",
   "Lars Magnus Hvattum"
  ],
  "publicationDate": "2020",
  "venue": "IMA Journal of Management Mathematics",
  "doi": "10.1093/imaman/dpz004",
  "keywords": [
   "soccer",
   "passing",
   "player rating",
   "generalized additive mixed model",
   "regression",
   "football"
  ],
  "teaser": "In this paper, the passing ability of football players is determined by building three generalized additive mixed models that each explains a different aspect of a pass’ success: difficulty, risk and potential. The"
 },
 {
  "id": "evolution-at-the-core-of-digital-twin-engineering-17007a",
  "nodeNumber": "0114",
  "docId": "160",
  "sourceFile": "Evolution at the Core of Digital Twin Engineering.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Evolution at the Core of Digital Twin Engineering",
  "authors": [
   "Tarek Alskaif",
   "Önder Babur",
   "Francis Bordeleau",
   "Loek Cleophas",
   "Benoit Combemale",
   "Joachim Denil",
   "Øystein Haugen",
   "Judith Michael",
   "Phu Nguyen",
   "Tiberiu Seceleanu",
   "Mark van den Brand",
   "Hans Vangheluwe"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "digital twin engineering",
   "evolution",
   "lifecycle",
   "devops",
   "software engineering",
   "model-driven engineering"
  ],
  "teaser": "Engineering Digital Twins (EDT) presents a multifaceted challenge that extends beyond managing the lifecycle of a Digital Twin (DT) to include its continuous, dynamic interaction with the lifecycle of the actual object,"
 },
 {
  "id": "examining-the-interplay-between-big-data-analytics-and-ab909a",
  "nodeNumber": "0115",
  "docId": "142",
  "sourceFile": "4.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Examining the interplay between big data analytics and contextual factors in driving process innovation capabilities",
  "authors": [
   "Patrick Mikalef",
   "John Krogstie"
  ],
  "publicationDate": "2020-04-16",
  "venue": "European Journal of Information Systems",
  "doi": "10.1080/0960085X.2020.1740618",
  "keywords": [
   "big data analytics",
   "process innovation capabilities",
   "fsqca",
   "resource-based view",
   "contingency theory"
  ],
  "teaser": "The potential of big data analytics in enabling improvements in business processes has urged researchers and practitioners to understand if, and under what combination of conditions, such novel technologies can support"
 },
 {
  "id": "explainable-artificial-intelligence-xai-from-a-user-5c4623",
  "nodeNumber": "0116",
  "docId": "144",
  "sourceFile": "6.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Explainable Artificial Intelligence (XAI) from a user perspective: A synthesis of prior literature and problematizing avenues for future research",
  "authors": [
   "AKM Bahalul Haque",
   "A.K.M. Najmul Islam",
   "Patrick Mikalef"
  ],
  "publicationDate": "2023",
  "venue": "Technological Forecasting & Social Change",
  "doi": "10.1016/j.techfore.2022.122120",
  "keywords": [
   "explainable ai",
   "xai",
   "trust",
   "transparency",
   "understandability",
   "ai adoption"
  ],
  "teaser": "The rapid growth and use of artificial intelligence (AI)-based systems have raised concerns regarding explainability. Recent studies have discussed the emerging demand for explainable AI (XAI); however, a systematic"
 },
 {
  "id": "exploring-occupant-detection-model-generalizability-for-7d7fe7",
  "nodeNumber": "0117",
  "docId": "81",
  "sourceFile": "1-s2.0-S0360132324001616-main.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Exploring occupant detection model generalizability for residential buildings using supervised learning with IEQ sensors",
  "authors": [
   "Kamilla Heimar Andersen",
   "Hicham Johra",
   "Markus Schaffer",
   "Anna Marszal-Pomianowska",
   "Henrik N. Knudsen",
   "Per Kvols Heiselberg",
   "William O’Brien"
  ],
  "publicationDate": "2024-03-01",
  "venue": "Building and Environment",
  "doi": "10.1016/j.buildenv.2024.111319",
  "keywords": [
   "occupant detection",
   "residential buildings",
   "indoor environmental quality",
   "xgboost",
   "generalizability",
   "supervised learning"
  ],
  "teaser": "This study explores two modeling approaches for occupancy detection at room level for residential buildings in Denmark. The aim is to assess the performance and generalizability of occupant detection models using"
 },
 {
  "id": "extremum-seeking-control-for-harmonic-mitigation-in-9f8e61",
  "nodeNumber": "0118",
  "docId": "129",
  "sourceFile": "Extremum-Seeking_Control_for_Harmonic_Mitigation_in_Electrical_Grids_of_Marine_Vessels.pdf",
  "researcher": "Mark_Haring",
  "title": "Extremum-Seeking Control for Harmonic Mitigation in Electrical Grids of Marine Vessels",
  "authors": [
   "Mark Haring",
   "Espen Skjong",
   "Tor Arne Johansen",
   "Marta Molinas"
  ],
  "publicationDate": "2019-01",
  "venue": "IEEE Transactions on Industrial Electronics",
  "doi": "10.1109/TIE.2018.2826472",
  "keywords": [
   "active power filter",
   "extremum-seeking control",
   "harmonic mitigation",
   "power grids",
   "marine vessels",
   "model-free optimization"
  ],
  "teaser": "This paper focuses on the minimization of the harmonic distortion in multibus electrical grids of marine vessels using a single active power filter. An active power filter is commonly used for local harmonic mitigation."
 },
 {
  "id": "extremum-seeking-control-for-nonlinear-systems-with-bc3249",
  "nodeNumber": "0119",
  "docId": "125",
  "sourceFile": "1-s2.0-S0005109813001519-main.pdf",
  "researcher": "Mark_Haring",
  "title": "Extremum-seeking control for nonlinear systems with periodic steady-state outputs",
  "authors": [
   "Mark Haring",
   "Nathan van de Wouw",
   "Dragan Nešić"
  ],
  "publicationDate": "2013-05",
  "venue": "Automatica",
  "doi": "10.1016/j.automatica.2013.02.061",
  "keywords": [
   "extremum-seeking control",
   "performance optimization",
   "semi-global practical stability",
   "periodic systems",
   "nonlinear systems"
  ],
  "teaser": "Extremum-seeking control is a powerful adaptive technique to optimize system performance. To this date, extremum-seeking control has mainly been used to optimize plants with constant steady-state outputs, whereas the"
 },
 {
  "id": "factors-affecting-shipyard-operations-and-logistics-a-8b940c",
  "nodeNumber": "0120",
  "docId": "94",
  "sourceFile": "Strandhagen et al. (2020) Factors Affecting Shipyard Operations and Logistics.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Factors Affecting Shipyard Operations and Logistics: A Framework and Comparison of Shipbuilding Approaches",
  "authors": [
   "Jo Wessel Strandhagen",
   "Yongkuk Jeong",
   "Jong Hun Woo",
   "Marco Semini",
   "Magnus Wiktorsson",
   "Jan Ola Strandhagen",
   "Erlend Alfnes"
  ],
  "publicationDate": "2020",
  "venue": "IFIP International Federation for Information Processing (APMS 2020)",
  "doi": "10.1007/978-3-030-57997-5_61",
  "keywords": [
   "shipbuilding",
   "shipyard",
   "logistics",
   "engineer-to-order manufacturing",
   "framework",
   "comparative analysis"
  ],
  "teaser": "Shipyards around the world have several differences that affect the logistics processes at each yard. The purpose of this paper is to develop a framework for mapping the key factors affecting shipyard logistics. We test"
 },
 {
  "id": "fast-divergence-conforming-reduced-basis-methods-for-steady-0161d2",
  "nodeNumber": "0121",
  "docId": "271",
  "sourceFile": "Fonn2019fdc.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Fast divergence-conforming reduced basis methods for steady Navier–Stokes flow",
  "authors": [
   "Eivind Fonn",
   "Harald van Brummelen",
   "Trond Kvamsdal",
   "Adil Rasheed"
  ],
  "publicationDate": "2019-03-15",
  "venue": "Computer Methods in Applied Mechanics and Engineering",
  "doi": "10.1016/j.cma.2018.11.038",
  "keywords": [
   "reduced order modeling",
   "reduced basis method",
   "isogeometric analysis",
   "divergence-conforming",
   "navier-stokes",
   "solenoidal"
  ],
  "teaser": "Reduced-basis methods (RB methods or RBMs) form one of the most promising techniques to deliver numerical solutions of parametrized PDEs in real-time with reasonable accuracy. For incompressible flow problems, RBMs"
 },
 {
  "id": "fault-detection-and-diagnosis-encyclopedia-for-building-8f0f94",
  "nodeNumber": "0122",
  "docId": "87",
  "sourceFile": "energies-15-04366-v3.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Fault Detection and Diagnosis Encyclopedia for Building Systems: A Systematic Review",
  "authors": [
   "Simon P. Melgaard",
   "Kamilla H. Andersen",
   "Anna Marszal-Pomianowska",
   "Rasmus L. Jensen",
   "Per K. Heiselberg"
  ],
  "publicationDate": "2022-06-15",
  "venue": "Energies",
  "doi": "10.3390/en15124366",
  "keywords": [
   "fault detection and diagnosis (fdd)",
   "systematic review",
   "building systems",
   "hvac",
   "model-based methods",
   "data-based methods"
  ],
  "teaser": "This review aims to provide an up-to-date, comprehensive, and systematic summary of fault detection and diagnosis (FDD) in building systems. The latter was performed through a defined systematic methodology with the"
 },
 {
  "id": "fault-detection-and-prediction-in-smart-grids-74577d",
  "nodeNumber": "0123",
  "docId": "43",
  "sourceFile": "9.pdf",
  "researcher": "Christian_Andresen",
  "title": "Fault Detection and Prediction in Smart Grids",
  "authors": [
   "Christian Andre Andresen",
   "Kjetil Uhlen",
   "Bendik Nybakk Torsæter",
   "Hallvar Haugdal"
  ],
  "publicationDate": "2018",
  "venue": "IEEE",
  "doi": null,
  "keywords": [
   "smart grids",
   "fault detection",
   "fault prediction",
   "machine learning",
   "power quality",
   "pmu"
  ],
  "teaser": "Modern society is to a larger and larger extent dependent on electric energy, and hence the reliance on and utilization of the electric grid is increasing steadily. At the same time the production and consumption"
 },
 {
  "id": "fault-detection-in-ahu-a-walkthrough-for-implementation-in-6daa78",
  "nodeNumber": "0124",
  "docId": "83",
  "sourceFile": "1-s2.0-S0378778825005742-main.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Fault detection in AHU: A walkthrough for implementation in a Danish educational building",
  "authors": [
   "Simon Pommerencke Melgaard",
   "Rasmus Lund Jensen",
   "Pedro Miguel Ferreira",
   "Kamilla Heimar Andersen",
   "Nuno Dionisio",
   "Vinicius Vielmo Cogo",
   "Per Kvols Heiselberg"
  ],
  "publicationDate": "2025-05-09",
  "venue": "Energy & Buildings",
  "doi": "10.1016/j.enbuild.2025.115844",
  "keywords": [
   "fault detection",
   "unsupervised machine learning",
   "implementation",
   "bms",
   "hvac",
   "ahu"
  ],
  "teaser": "The implementation of fault detection in research articles is relatively sparse, yet it holds significant potential to contribute to the decarbonization of our building stock. This study proposes a Fault Detection (FD)"
 },
 {
  "id": "flipping-based-policy-for-chance-constrained-markov-f2bf61",
  "nodeNumber": "0125",
  "docId": "210",
  "sourceFile": "NeurIPS-2024-flipping-based-policy-for-chance-constrained-markov-decision-processes-Paper-Conference.pdf",
  "researcher": "Sebastien Gros",
  "title": "Flipping-based Policy for Chance-Constrained Markov Decision Processes",
  "authors": [
   "Xun Shen",
   "Shuo Jiang",
   "Akifumi Wachi",
   "Kazumune Hashimoto",
   "Sébastien Gros"
  ],
  "publicationDate": "2024",
  "venue": "38th Conference on Neural Information Processing Systems (NeurIPS 2024)",
  "doi": null,
  "keywords": [
   "safe reinforcement learning",
   "chance constraints",
   "markov decision processes",
   "stochastic policies",
   "flipping-based policy",
   "constrained optimization"
  ],
  "teaser": "Safe reinforcement learning (RL) is a promising approach for many real-world decision-making problems where ensuring safety is a critical necessity. In safe RL research, while expected cumulative safety constraints"
 },
 {
  "id": "fomosim-an-open-source-simulator-for-rigorous-analysis-of-80426a",
  "nodeNumber": "0126",
  "docId": "71",
  "sourceFile": "2025_FOMOsim An open-source simulator for rigorous analysis of micromobility planning problems.pdf",
  "researcher": "Henrik_Andersson",
  "title": "FOMOsim: An open-source simulator for rigorous analysis of micromobility planning problems",
  "authors": [
   "Steffen J.S. Bakker",
   "Mohamed Ben Ahmed",
   "Asbjørn Djupdal",
   "Lasse Natvig",
   "Henrik Andersson",
   "Magnus Jahre",
   "Kjetil Fagerholt"
  ],
  "publicationDate": "2025-01",
  "venue": "Expert Systems With Applications",
  "doi": "10.1016/j.eswa.2024.125842",
  "keywords": [
   "discrete-event simulation",
   "bike sharing systems",
   "rebalancing",
   "fleet sizing",
   "inventory management",
   "benchmark instances"
  ],
  "teaser": "Existing simulation models for micromobility systems often face significant limitations: they are typically custom-built for specific contexts, lack generalizability, are not open-source, and undergo limited testing,"
 },
 {
  "id": "fomosim-an-open-source-simulator-for-rigorous-analysis-of-e78264",
  "nodeNumber": "0127",
  "docId": "242",
  "sourceFile": "8.pdf",
  "researcher": "Steffen_Bakker",
  "title": "FOMOsim: An open-source simulator for rigorous analysis of micromobility planning problems",
  "authors": [
   "Steffen J.S. Bakker",
   "Mohamed Ben Ahmed",
   "Asbjørn Djupdal",
   "Lasse Natvig",
   "Henrik Andersson",
   "Magnus Jahre",
   "Kjetil Fagerholt"
  ],
  "publicationDate": "2024-11-23",
  "venue": "Expert Systems With Applications",
  "doi": "10.1016/j.eswa.2024.125842",
  "keywords": [
   "discrete-event simulation",
   "bike sharing systems",
   "rebalancing",
   "fleet sizing",
   "inventory management",
   "benchmark instances"
  ],
  "teaser": "Existing simulation models for micromobility systems often face significant limitations: they are typically custom-built for specific contexts, lack generalizability, are not open-source, and undergo limited testing,"
 },
 {
  "id": "further-development-and-validation-of-the-profet-energy-49d667",
  "nodeNumber": "0128",
  "docId": "84",
  "sourceFile": "bs2021_30159.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Further development and validation of the \"PROFet\" energy demand load profiles estimator",
  "authors": [
   "Kamilla H. Andersen",
   "Synne K. Lien",
   "Harald T. Walnum",
   "Karen B. Lindberg",
   "Igor Sartori"
  ],
  "publicationDate": "2021-09-01",
  "venue": "Proceedings of the 17th IBPSA Conference",
  "doi": "10.26868/25222708.2021.30159",
  "keywords": [
   "energy demand",
   "load profiles",
   "building efficiency",
   "energy forecasting",
   "district heating",
   "energy flexibility"
  ],
  "teaser": "Long-term forecasts of the aggregate energy load profiles are crucial for energy system planning. Previous work has developed a load profile model named PROFet to forecast aggregated weather-dependent load profiles with"
 },
 {
  "id": "generation-of-erosion-hotspot-zones-along-the-streams-by-9c6e7f",
  "nodeNumber": "0129",
  "docId": "78",
  "sourceFile": "Generation_of_erosion_hotspot_zones_along_the_stre.pdf",
  "researcher": "Ivan_Depina",
  "title": "Generation of erosion hotspot zones along the streams by incorporating significant factors and deep neural network",
  "authors": [
   "Ankit Tyagi",
   "Ivan Depina",
   "Cristian Andres Godoy Leiva"
  ],
  "publicationDate": "2025-06-21",
  "venue": "Modeling Earth Systems and Environment",
  "doi": "10.1007/s40808-025-02480-2",
  "keywords": [
   "quick clay landslides",
   "erosion hotspot zones",
   "artificial intelligence",
   "remote sensing",
   "deep neural networks",
   "geohazards"
  ],
  "teaser": "An erosion-induced quick clay landslide (QCL) is a geological hazard that poses a severe risk to human life and property. The recent disaster in Norway at Gjerdrum in 2020 caused loss of 11 lives and destroyed many"
 },
 {
  "id": "guidelines-for-standardised-classification-and-failure-9c4bc7",
  "nodeNumber": "0130",
  "docId": "122",
  "sourceFile": "APOS-Guidelines-for-standardised-classification-and-failure-reporting-signed (1).pdf",
  "researcher": "Maria_V_Ottermo",
  "title": "Guidelines for standardised classification and failure reporting for safety equipment in the petroleum industry",
  "authors": [
   "Stein Hauge",
   "Solfrid Håbrekke",
   "Mary Ann Lundteigen",
   "Shenae Lee",
   "Maria Vatshaug Ottermo"
  ],
  "publicationDate": "2023-03-10",
  "venue": "SINTEF",
  "doi": null,
  "keywords": [
   "safety instrumented systems",
   "equipment grouping",
   "failure taxonomies",
   "standardisation",
   "information model",
   "petroleum industry"
  ],
  "teaser": "This document provides guidance on how to report and classify failure and maintenance data for safety equipment, as a basis for improved follow-up and future automation. Standardised equipment grouping, equipment"
 },
 {
  "id": "hierarchical-distributed-optimization-based-bidding-0aa8d1",
  "nodeNumber": "0131",
  "docId": "176",
  "sourceFile": "1-s2.0-S0306261925013923-main.pdf",
  "researcher": "Sebastien Gros",
  "title": "Hierarchical distributed optimization based bidding algorithm for electric water heater flexibility aggregators in nordic energy activation markets",
  "authors": [
   "Surya Venkatesh Pandiyan",
   "Jayaprakash Rajasekharan",
   "Sebastien Gros"
  ],
  "publicationDate": "2025-09-15",
  "venue": "Applied Energy",
  "doi": "10.1016/j.apenergy.2025.126662",
  "keywords": [
   "electric water heaters",
   "bidding algorithm",
   "distributed optimization",
   "frequency regulation",
   "reserve markets",
   "energy activation markets"
  ],
  "teaser": "Coordinated flexibility from electric water heaters (EWHs) holds significant potential to provide frequency regulation services through reserve markets, particularly manual frequency restoration reserve (mFRR) in near"
 },
 {
  "id": "human-factors-validation-of-complex-human-technology-107413",
  "nodeNumber": "0132",
  "docId": "152",
  "sourceFile": "Braarud-et-al-2025-Human-Factors-Validation-Research-Needs.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "Human factors validation of complex human-technology systems – Need for updating the technical basis and improving the guides and standards",
  "authors": [
   "Per Øivind Braarud",
   "Jinkyun Park",
   "Jitae Kim",
   "Johnny Short"
  ],
  "publicationDate": "2025-01",
  "venue": "Safety Science",
  "doi": "10.1016/j.ssci.2024.106697",
  "keywords": [
   "human factors",
   "validation",
   "integrated system validation",
   "human performance",
   "nuclear power plants",
   "standards"
  ],
  "teaser": "Human Factors validation is a critical step in the design and development of complex human-technology systems such as nuclear power plants. Unfortunately, frequent validation challenges are reported by designers,"
 },
 {
  "id": "hybrid-analysis-and-modeling-eclecticism-and-multifidelity-ed6b5c",
  "nodeNumber": "0133",
  "docId": "276",
  "sourceFile": "San2021haa.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Hybrid analysis and modeling, eclecticism, and multifidelity computing toward digital twin revolution",
  "authors": [
   "Omer San",
   "Adil Rasheed",
   "Trond Kvamsdal"
  ],
  "publicationDate": "2021-05-28",
  "venue": "GAMM-Mitteilungen",
  "doi": "10.1002/gamm.202100007",
  "keywords": [
   "digital twin",
   "hybrid analysis and modeling",
   "interface learning",
   "neurophysical computing",
   "reduced order modeling",
   "scientific machine learning"
  ],
  "teaser": "Most modeling approaches lie in either of the two categories: physics-based or data-driven. Recently, a third approach which is a combination of these deterministic and statistical models is emerging for scientific"
 },
 {
  "id": "hyperspheric-integral-reliability-method-for-efficient-3d4521",
  "nodeNumber": "0134",
  "docId": "75",
  "sourceFile": "1-s2.0-S0266352X24008000-main-1.pdf",
  "researcher": "Ivan_Depina",
  "title": "Hyperspheric Integral Reliability Method for efficient reliability analysis of geotechnical ultimate limit states",
  "authors": [
   "Ivan Depina"
  ],
  "publicationDate": "2025-01",
  "venue": "Computers and Geotechnics",
  "doi": "10.1016/j.compgeo.2024.106861",
  "keywords": [
   "reliability",
   "geotechnical",
   "ultimate limit states",
   "hyperspheric",
   "shear strength reduction",
   "hint"
  ],
  "teaser": "This paper introduces the Hyperspheric Integral Reliability Method (HINT) for efficient reliability analysis of geotechnical ultimate limit states. The method is motivated by the mechanism of the Shear Strength"
 },
 {
  "id": "impact-of-seasonal-weather-on-forecasting-of-power-quality-ee5e38",
  "nodeNumber": "0135",
  "docId": "39",
  "sourceFile": "5.pdf",
  "researcher": "Christian_Andresen",
  "title": "Impact of seasonal weather on forecasting of power quality disturbances in distribution grids",
  "authors": [
   "Katarzyna Michałowska",
   "Volker Hoffmann",
   "Christian Andresen"
  ],
  "publicationDate": "2020",
  "venue": "IEEE",
  "doi": null,
  "keywords": [
   "power quality",
   "distribution grids",
   "seasonal weather",
   "predictive modeling",
   "machine learning",
   "power system reliability"
  ],
  "teaser": "Power supply disruptions, including short-time disturbances, can lead to large direct and indirect financial losses. The ability to predict the risk of these disturbances allows for preventive actions and increases the"
 },
 {
  "id": "impact-of-the-temporal-distribution-of-faults-on-prediction-acdd62",
  "nodeNumber": "0136",
  "docId": "41",
  "sourceFile": "7.pdf",
  "researcher": "Christian_Andresen",
  "title": "Impact of the Temporal Distribution of Faults on Prediction of Voltage Anomalies in the Power Grid",
  "authors": [
   "Torfinn Skarvatun Tyvold",
   "Bendik Nybakk Torsæter",
   "Christian André Andresen",
   "Volker Hoffmann"
  ],
  "publicationDate": "2020",
  "venue": "IEEE",
  "doi": "10.1109/ISGT-Europe47905.2020.9248791",
  "keywords": [
   "power quality analysis",
   "power systems",
   "machine learning",
   "fault prediction",
   "voltage anomalies",
   "temporal distribution"
  ],
  "teaser": "Is it possible to reliably predict voltage anomalies in the power grid minutes in advance using machine learning models trained on large quantities of historical data collected by power quality analysers (PQA)? Very"
 },
 {
  "id": "impact-of-typical-faults-occurring-in-demand-controlled-1ab44a",
  "nodeNumber": "0137",
  "docId": "86",
  "sourceFile": "e3sconf_nsb2020_09006.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Impact of Typical Faults Occurring in Demand-controlled Ventilation on Energy and Indoor Environment in a Nordic Climate",
  "authors": [
   "Kamilla Heimar Andersen",
   "Sverre B. Holøs",
   "Aileen Yang",
   "Kari Thunshelle",
   "Øystein Fjellheim",
   "Rasmus Lund Jensen"
  ],
  "publicationDate": "2020",
  "venue": "E3S Web of Conferences",
  "doi": "10.1051/e3sconf/202017209006",
  "keywords": [
   "hvac",
   "demand-controlled ventilation",
   "energy efficiency",
   "indoor air quality",
   "thermal comfort",
   "fault detection"
  ],
  "teaser": "This study evaluates typical faults occurring in demand-controlled ventilation (DCV) system and the impact on three output results: energy use, thermal comfort, and indoor air quality. The methodologies used in this"
 },
 {
  "id": "inferring-feature-importance-with-uncertainties-in-high-eb70d7",
  "nodeNumber": "0138",
  "docId": "221",
  "sourceFile": "2109.00855v3.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Inferring feature importance with uncertainties in high-dimensional data",
  "authors": [
   "Pål Vegard Johnsen",
   "Inga Strømke",
   "Signe Riemer-Sørensen",
   "Andrew Thomas DeWan",
   "Mette Langaas"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": "10.48550/arXiv.2109.00855",
  "keywords": [
   "feature importance",
   "shapley values",
   "uncertainty estimation",
   "tree ensemble models",
   "machine learning",
   "high-dimensional data"
  ],
  "teaser": "Estimating feature importance is a significant aspect of explaining data-based models. Besides explaining the model itself, an equally relevant question is which features are important in the underlying data generating"
 },
 {
  "id": "integrated-resource-scheduling-for-patient-appointment-fd5086",
  "nodeNumber": "0139",
  "docId": "72",
  "sourceFile": "2025_Integrated resource scheduling for patient appointment series-Designing tactical blueprints for an orthopedic clinic.pdf",
  "researcher": "Henrik_Andersson",
  "title": "Integrated resource scheduling for patient appointment series — Designing tactical blueprints for an orthopedic clinic",
  "authors": [
   "Sara Bigharaz",
   "Henrik Andersson",
   "Anders N. Gullhav",
   "Thomas Reiten Bovim"
  ],
  "publicationDate": "2025-05-03",
  "venue": "Operations Research, Data Analytics and Logistics",
  "doi": "10.1016/j.ordal.2025.200475",
  "keywords": [
   "healthcare scheduling",
   "blueprint scheduling",
   "operating room management",
   "outpatient clinic",
   "resource allocation",
   "queuing theory"
  ],
  "teaser": "Managing the time that patients wait for their next appointment is a well-known challenge in hospitals. Scarce resources must be efficiently planned and coordinated to create schedules that allow departments of a"
 },
 {
  "id": "integration-of-energy-communities-via-multi-level-dynamic-93a7b1",
  "nodeNumber": "0140",
  "docId": "207",
  "sourceFile": "Integration_of_Energy_Communities_via_Multi-Level_Dynamic_Markets.pdf",
  "researcher": "Sebastien Gros",
  "title": "Integration of Energy Communities via Multi-level Dynamic Markets",
  "authors": [
   "Younes Zahraoui",
   "Sebastien Gros",
   "Jayaprakash Rajasekharan",
   "Irina Oleinikova"
  ],
  "publicationDate": null,
  "venue": "IEEE Xplore",
  "doi": null,
  "keywords": [
   "local energy market",
   "battery energy storage",
   "energy community",
   "shared energy storage system",
   "multi-level markets",
   "model predictive control"
  ],
  "teaser": "Energy Communities (ECs) are groups of prosumers engaging in local energy trading, typically within the shared infrastructure (e.g., behind the same transformer). Local energy markets have emerged as a solution to"
 },
 {
  "id": "jutuldarcy-jl-a-fully-differentiable-high-performance-b78b7a",
  "nodeNumber": "0141",
  "docId": "136",
  "sourceFile": "jd.pdf",
  "researcher": "Olav Møyner",
  "title": "JutulDarcy.jl - a fully differentiable high-performance reservoir simulator based on automatic differentiation",
  "authors": [
   "Olav Møyner"
  ],
  "publicationDate": "2025-07-11",
  "venue": "Computational Geosciences",
  "doi": "10.1007/s10596-025-10366-6",
  "keywords": [
   "julia",
   "reservoir simulation",
   "compositional flow",
   "automatic differentiation",
   "high performance computing",
   "differentiable programming"
  ],
  "teaser": "Reservoir simulators are highly complex computer programs and are often treated as “black boxes” that act on standardized input formats. In part, this is due to the closed-source nature of commercial offerings commonly"
 },
 {
  "id": "large-scale-offshore-wind-development-and-decarbonization-e2ef77",
  "nodeNumber": "0142",
  "docId": "34",
  "sourceFile": "11.pdf",
  "researcher": "Christian_Andresen",
  "title": "Large-scale Offshore Wind Development and Decarbonization Pathways of the Norwegian Energy System",
  "authors": [
   "Dana Reulein",
   "Shweta Tiwari",
   "Birk Hestvik",
   "Aleksander Kvannli",
   "Dimitri Pinel",
   "Christian Andre Andresen",
   "Hossein Farahmand"
  ],
  "publicationDate": "2023",
  "venue": "IEEE",
  "doi": "10.1109/PECon.2023.10092345",
  "keywords": [
   "energy systems",
   "offshore wind",
   "norwegian energy system",
   "decarbonization",
   "capacity expansion",
   "energy dispatch"
  ],
  "teaser": "Modelling of the energy system in the countries surrounding the North Sea is performed with a focus on Norway and offshore wind farms situated in the North Sea. The geographically heterogeneous consumption and"
 },
 {
  "id": "learned-multiphysics-inversion-with-differentiable-8e19cf",
  "nodeNumber": "0143",
  "docId": "137",
  "sourceFile": "jdiff.pdf",
  "researcher": "Olav Møyner",
  "title": "Learned multiphysics inversion with differentiable programming and machine learning",
  "authors": [
   "Mathias Louboutin",
   "Ziyi Yin",
   "Rafael Orozco",
   "Thomas J. Grady II",
   "Ali Siahkoohi",
   "Gabrio Rizzuti",
   "Philipp A. Witte",
   "Olav Møyner",
   "Gerard J. Gorman",
   "Felix J. Herrmann"
  ],
  "publicationDate": "2023-07",
  "venue": "The Leading Edge",
  "doi": "10.1190/tle42070474.1",
  "keywords": [
   "computational geophysics",
   "inverse problems",
   "differentiable programming",
   "machine learning",
   "wave equation",
   "multiphysics"
  ],
  "teaser": "We present the Seismic Laboratory for Imaging and Modeling/Monitoring open-source software framework for computational geophysics and, more generally, inverse problems involving the wave equation (e.g., seismic and"
 },
 {
  "id": "learning-based-robust-model-predictive-control-for-sector-1f4a71",
  "nodeNumber": "0144",
  "docId": "134",
  "sourceFile": "Seel_LearningBasedRobustModelPredictiveControlForSectorBoundedLureSystems2021.pdf",
  "researcher": "Mark_Haring",
  "title": "Learning-based Robust Model Predictive Control for Sector-bounded Lur’e Systems",
  "authors": [
   "Katrine Seel",
   "Mark Haring",
   "Esten I. Grøtli",
   "Kristin Y. Pettersen",
   "Jan T. Gravdahl"
  ],
  "publicationDate": "2021",
  "venue": "IFAC PapersOnLine",
  "doi": "10.1016/j.ifacol.2021.11.151",
  "keywords": [
   "mpc",
   "bayesian linear regression",
   "robust control",
   "sector-bounded systems",
   "lur’e systems",
   "model predictive control"
  ],
  "teaser": "For dynamical systems with uncertainty, robust controllers can be designed by assuming that the uncertainty is bounded. The less we know about the uncertainty in the system, the more conservative the bound must be,"
 },
 {
  "id": "learning-based-robust-model-predictive-control-for-sector-2ffcbb",
  "nodeNumber": "0145",
  "docId": "51",
  "sourceFile": "Seel_LearningBasedRobustModelPredictiveControlForSectorBoundedLureSystems2021.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Learning-based Robust Model Predictive Control for Sector-bounded Lur’e Systems",
  "authors": [
   "Katrine Seel",
   "Mark Haring",
   "Esten I. Grøtli",
   "Kristin Y. Pettersen",
   "Jan T. Gravdahl"
  ],
  "publicationDate": "2021",
  "venue": "IFAC PapersOnLine",
  "doi": "10.1016/j.ifacol.2021.11.151",
  "keywords": [
   "mpc",
   "bayesian linear regression",
   "robust control",
   "lur’e systems",
   "sector-bounded uncertainty",
   "model predictive control"
  ],
  "teaser": "For dynamical systems with uncertainty, robust controllers can be designed by assuming that the uncertainty is bounded. The less we know about the uncertainty in the system, the more conservative the bound must be,"
 },
 {
  "id": "learning-dynamical-systems-from-noisy-data-with-inverse-760db0",
  "nodeNumber": "0146",
  "docId": "254",
  "sourceFile": "1-s2.0-S0167278924004214-main.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Learning dynamical systems from noisy data with inverse-explicit integrators",
  "authors": [
   "Elena Celledoni",
   "Sølve Eidnes",
   "Håkon Noren Myhr"
  ],
  "publicationDate": "2025-01",
  "venue": "Physica D: Nonlinear Phenomena",
  "doi": "10.1016/j.physd.2024.134471",
  "keywords": [
   "hamiltonian neural networks",
   "mono-implicit runge–kutta methods",
   "physics-informed machine learning",
   "numerical integration",
   "dynamical systems",
   "noisy data"
  ],
  "teaser": "We introduce the mean inverse integrator (MII), a novel approach that improves accuracy when training neural networks to approximate vector fields of dynamical systems using noisy data. This method can be used to"
 },
 {
  "id": "learning-for-mpc-with-stability-safety-guarantees-2c9af4",
  "nodeNumber": "0147",
  "docId": "187",
  "sourceFile": "2012.07369v2.pdf",
  "researcher": "Sebastien Gros",
  "title": "Learning for MPC with Stability & Safety Guarantees",
  "authors": [
   "Sebastien Gros",
   "Mario Zanon"
  ],
  "publicationDate": "2022-07-25",
  "venue": "Automatica",
  "doi": null,
  "keywords": [
   "safe mpc learning",
   "safe mpc-based policies",
   "safe reinforcement learning",
   "robust mpc",
   "stability",
   "model predictive control"
  ],
  "teaser": "The combination of learning methods with Model Predictive Control (MPC) has attracted a significant amount of attention in the recent literature. The hope of this combination is to reduce the reliance of MPC schemes on"
 },
 {
  "id": "learning-similarity-measures-from-data-0cb84f",
  "nodeNumber": "0148",
  "docId": "54",
  "sourceFile": "1.pdf",
  "researcher": "Helge_Langseth",
  "title": "Learning similarity measures from data",
  "authors": [
   "Bjørn Magnus Mathisen",
   "Agnar Aamodt",
   "Kerstin Bach",
   "Helge Langseth"
  ],
  "publicationDate": "2019-10-30",
  "venue": "Progress in Artificial Intelligence",
  "doi": "10.1007/s13748-019-00201-2",
  "keywords": [
   "similarity measure",
   "case-based reasoning",
   "neural networks",
   "machine learning",
   "data-driven",
   "siamese networks"
  ],
  "teaser": "Defining similarity measures is a requirement for some machine learning methods. One such method is case-based reasoning (CBR) where the similarity measure is used to retrieve the stored case or a set of cases most"
 },
 {
  "id": "least-squares-projected-models-for-non-intrusive-638ed8",
  "nodeNumber": "0149",
  "docId": "272",
  "sourceFile": "Fonn2025lsp.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Least-Squares Projected Models for Non-Intrusive Affinization of Reduced Basis Methods",
  "authors": [
   "Eivind Fonn",
   "Harald van Brummelen",
   "Jørgen L. Eftang",
   "Tore Rusten",
   "Kjetil A. Johannessen",
   "Trond Kvamsdal",
   "Adnan Rasheed"
  ],
  "publicationDate": "2025",
  "venue": "International Journal for Numerical Methods in Engineering",
  "doi": "10.1002/nme.70127",
  "keywords": [
   "elasticity",
   "finite element methods",
   "galerkin",
   "reduced basis methods",
   "reduced order models",
   "solids"
  ],
  "teaser": "Reduced-basis methods (RBMs) constitute a promising technique for delivering numerical solutions of parameterized PDEs in real time and with reasonable accuracy. The most significant drawback of RBMs is the requirement"
 },
 {
  "id": "lecture-notes-in-probabilistic-diffusion-models-a0807d",
  "nodeNumber": "0150",
  "docId": "61",
  "sourceFile": "7.pdf",
  "researcher": "Helge_Langseth",
  "title": "Lecture Notes in Probabilistic Diffusion Models",
  "authors": [
   "Inga Strømke",
   "Helge Langseth"
  ],
  "publicationDate": "2023",
  "venue": null,
  "doi": null,
  "keywords": [
   "diffusion models",
   "probabilistic models",
   "machine learning",
   "generative models",
   "markov chains",
   "gaussian distributions"
  ],
  "teaser": "Diffusion models are loosely modelled based on non-equilibrium thermodynamics, where diffusion refers to particles flowing from high-concentration regions towards low-concentration regions. In statistics, the meaning is"
 },
 {
  "id": "lessons-for-data-driven-modelling-from-harmonics-in-the-edcdfe",
  "nodeNumber": "0151",
  "docId": "37",
  "sourceFile": "3.pdf",
  "researcher": "Christian_Andresen",
  "title": "Lessons for Data-Driven Modelling from Harmonics in the Norwegian Grid",
  "authors": [
   "Volker Hoffmann",
   "Bendik Nybakk Torsæter",
   "Gjert Hovland Rosenlund",
   "Christian Andre Andresen"
  ],
  "publicationDate": "2022-05-31",
  "venue": "Algorithms",
  "doi": "10.3390/a15060188",
  "keywords": [
   "machine learning",
   "power systems",
   "harmonic distortion",
   "power quality"
  ],
  "teaser": "With the advancing integration of fluctuating renewables, a more dynamic demand-side, and a grid running closer to its operational limits, future power system operators require new tools to anticipate unwanted events."
 },
 {
  "id": "linearly-implicit-structure-preserving-schemes-for-fd8cb6",
  "nodeNumber": "0152",
  "docId": "256",
  "sourceFile": "1901.03573v3.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Linearly implicit structure-preserving schemes for Hamiltonian systems",
  "authors": [
   "Sølve Eidnes",
   "Lu Li",
   "Shun Sato"
  ],
  "publicationDate": "2020-05-11",
  "venue": null,
  "doi": "10.1016/j.cma.2020.113201",
  "keywords": [
   "linearly implicit methods",
   "hamiltonian system",
   "energy preservation",
   "camassa–holm equation",
   "korteweg–de vries equation",
   "geometric numerical integration"
  ],
  "teaser": "Kahan’s method and a two-step generalisation of the discrete gradient method are both linearly implicit methods that can preserve a modified energy for Hamiltonian systems with a cubic Hamiltonian. These methods are"
 },
 {
  "id": "logistics-4-0-and-emerging-sustainable-business-models-722f3b",
  "nodeNumber": "0153",
  "docId": "90",
  "sourceFile": "Strandhagen et al. (2017) Logistics 4.0 and emerging sustainable business models.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Logistics 4.0 and emerging sustainable business models",
  "authors": [
   "Jan Ola Strandhagen",
   "Logan Reed Vallandingham",
   "Giuseppe Fragapane",
   "Jo Wessel Strandhagen",
   "Aili Birita Hætta Stangeland",
   "Nakul Sharma"
  ],
  "publicationDate": "2017-11-07",
  "venue": "International Journal of Advanced Manufacturing Technology",
  "doi": "10.1007/s40436-017-0198-1",
  "keywords": [
   "industry 4.0",
   "logistics 4.0",
   "business models",
   "sustainability",
   "supply chain",
   "digitalization"
  ],
  "teaser": "The drive towards Logistics 4.0 as an element of Industry 4.0 gives possibilities for new business models. Instant information exchange, automated solutions and real-time big data analysis are among the features of"
 },
 {
  "id": "machine-learning-in-wastewater-treatment-insights-from-742213",
  "nodeNumber": "0154",
  "docId": "261",
  "sourceFile": "2412.14030v2.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Machine learning in wastewater treatment: insights from modelling a pilot denitrification reactor",
  "authors": [
   "Eivind Bøhn",
   "Sølve Eidnes",
   "Kjell Rune Jonassen"
  ],
  "publicationDate": "2025-06-28",
  "venue": null,
  "doi": null,
  "keywords": [
   "denitrification",
   "digital twin",
   "machine learning",
   "wastewater treatment",
   "northern climates",
   "model interpretability"
  ],
  "teaser": "Wastewater treatment plants (WWTPs) are promising candidates for machine learning (ML) due to their societal relevance and data availability. However, differences in plant design, operation, and influent characteristics"
 },
 {
  "id": "machine-learning-ml-based-reduced-order-modelling-rom-for-ffcb7a",
  "nodeNumber": "0155",
  "docId": "280",
  "sourceFile": "Tannous2025mlb.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Machine learning (ML) based reduced order modelling (ROM) for linear and non-linear solid and structural mechanics",
  "authors": [
   "Mikhael Tannous",
   "Chady Ghnatios",
   "Eivind Fonn",
   "Trond Kvamsdal",
   "Francisco Chinesta"
  ],
  "publicationDate": "2025",
  "venue": "Advanced Modeling and Simulation in Engineering Sciences",
  "doi": "10.1186/s40323-025-00299-1",
  "keywords": [
   "reduced order modelling",
   "machine learning",
   "solid mechanics",
   "structural mechanics",
   "minimally intrusive approach",
   "proper orthogonal decomposition"
  ],
  "teaser": "Multiple model reduction techniques have been proposed to tackle linear and non-linear problems. Intrusive model order reduction techniques exhibit high accuracy levels; however, they are rarely used as a standalone"
 },
 {
  "id": "manywells-simulation-of-multiphase-flow-in-thousands-of-28666d",
  "nodeNumber": "0156",
  "docId": "73",
  "sourceFile": "2026_ManyWells Simulation of multiphase flow in thousands of wells.pdf",
  "researcher": "Henrik_Andersson",
  "title": "ManyWells: Simulation of multiphase flow in thousands of wells",
  "authors": [
   "Bjarne Grimstad",
   "Erlend Lundby",
   "Henrik Andersson"
  ],
  "publicationDate": "2026",
  "venue": "Geoenergy Science and Engineering",
  "doi": "10.1016/j.geoen.2025.214226",
  "keywords": [
   "multiphase flow",
   "simulation",
   "machine learning",
   "petroleum production",
   "data generation",
   "datasets"
  ],
  "teaser": "A multiphase flow simulator and curated datasets are shared with the community to facilitate research on machine learning and other data-driven methodologies. The simulator is based on a drift-flux model and provides"
 },
 {
  "id": "maritime-fleet-composition-under-future-greenhouse-gas-5079ac",
  "nodeNumber": "0157",
  "docId": "114",
  "sourceFile": "Loennechen et al (2024) - MARTRA.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "Maritime fleet composition under future greenhouse gas emission restrictions and uncertain fuel prices",
  "authors": [
   "Olav Loennechen",
   "Kjetil Fagerholt",
   "Benjamin Lagemann",
   "Magnus Stålhane"
  ],
  "publicationDate": "2024-01-23",
  "venue": "Maritime Transport Research",
  "doi": "10.1016/j.martra.2024.100103",
  "keywords": [
   "maritime transportation",
   "greenhouse gas emissions",
   "alternative fuels",
   "retrofit",
   "stochastic programming"
  ],
  "teaser": "This paper studies the maritime fleet composition problem with uncertain future fuel and carbon prices under the restriction of complying with future greenhouse gas (GHG) emission restrictions. We propose a two-stage"
 },
 {
  "id": "maritime-object-tracking-from-a-commercial-vessel-using-cdbb13",
  "nodeNumber": "0158",
  "docId": "53",
  "sourceFile": "Tokle_MaritimeObjectTrackingFromACommercialVesselUsingRadarsElectroOpticalCamerasAndNavigationalInstruments2025.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Maritime object tracking from a commercial vessel using radars, electro-optical cameras and navigational instruments",
  "authors": [
   "Lars-Christian Ness Tokle",
   "Erlend Solbakk Harbitz",
   "Johannes Tjønnås",
   "Torbjørn Barheim",
   "Esten Ingar Grøtli"
  ],
  "publicationDate": "2025-06-07",
  "venue": "Ocean Engineering",
  "doi": null,
  "keywords": [
   "maritime object tracking",
   "situational awareness",
   "heterogeneous sensor fusion",
   "radar",
   "electro-optical cameras",
   "navigational instruments"
  ],
  "teaser": "The aim of this work was to develop partial maritime situational awareness based on a tracking system using two radars, 12 cameras and common navigational instruments mounted on a commercial vessel operating on the"
 },
 {
  "id": "market-access-and-compliance-innovation-for-ai-based-4f1b5f",
  "nodeNumber": "0159",
  "docId": "268",
  "sourceFile": "Market access for AI-based FuSa systems v2025-04-14RG.pdf",
  "researcher": "Thor Myklebust",
  "title": "Market Access and Compliance Innovation for AI-Based Functional Safety Systems",
  "authors": [
   "Thor Myklebust"
  ],
  "publicationDate": "2025",
  "venue": "IEEE CAI Santa Clara 2025",
  "doi": null,
  "keywords": [
   "ai safety system",
   "worldwide compliance",
   "safety case",
   "market access",
   "functional safety",
   "compliance"
  ],
  "teaser": "The IEC Test Report Format (TRF) standardizes product testing and compliance, ensuring consistency across international standards and simplifying global certification. However, the increasing complexity of Artificial"
 },
 {
  "id": "mature-offshore-oil-field-development-solving-a-real-5fc421",
  "nodeNumber": "0160",
  "docId": "243",
  "sourceFile": "9.pdf",
  "researcher": "Steffen_Bakker",
  "title": "Mature offshore oil field development: Solving a real options problem using stochastic dual dynamic integer programming",
  "authors": [
   "Steffen J. Bakker",
   "Andreas Kleiven",
   "Stein-Erik Fleten",
   "Asgeir Tomasgard"
  ],
  "publicationDate": "2021-07-16",
  "venue": "Computers & Operations Research",
  "doi": "10.1016/j.cor.2021.105480",
  "keywords": [
   "sddip",
   "real options",
   "mature oil field development",
   "multistage stochastic integer programming",
   "offshore oil",
   "investment timing"
  ],
  "teaser": "Oil and gas companies are facing low output prices and are forced to focus on the development of mature fields. Relevant investment decisions for operators include lifetime-enhancing activities, such as drilling new"
 },
 {
  "id": "measuring-cognitive-workload-in-the-nuclear-control-room-a-ec0edd",
  "nodeNumber": "0161",
  "docId": "150",
  "sourceFile": "Braarud-2024-Measuring cognitive workload in the nuclear control room  a review.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "Measuring cognitive workload in the nuclear control room: a review",
  "authors": [
   "Per Øivind Braarud"
  ],
  "publicationDate": "2024-01-26",
  "venue": "Ergonomics",
  "doi": "10.1080/00140139.2024.2302381",
  "keywords": [
   "cognitive workload",
   "measurement",
   "control room",
   "operators",
   "nuclear",
   "human factors"
  ],
  "teaser": "Despite the substantial literature and human factors guidance, evaluators report challenges in selecting cognitive workload measures for the evaluation of complex human–technology systems. A review of 32 articles found"
 },
 {
  "id": "model-fusion-with-physics-guided-machine-learning-77a4f4",
  "nodeNumber": "0162",
  "docId": "273",
  "sourceFile": "Pawar2021mfw.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Model fusion with physics-guided machine learning: Projection-based reduced-order modeling",
  "authors": [
   "Suraj Pawar",
   "Omer San",
   "Aditya Nair",
   "Adil Rasheed",
   "Trond Kvamsdal"
  ],
  "publicationDate": "2021-06-29",
  "venue": "Physics of Fluids",
  "doi": "10.1063/5.0053349",
  "keywords": [
   "physics-guided machine learning",
   "reduced-order modeling",
   "fluid dynamics",
   "neural networks",
   "model fusion",
   "generalizability"
  ],
  "teaser": "The unprecedented amount of data generated from experiments, field observations, and large-scale numerical simulations at a wide range of spatiotemporal scales has enabled the rapid advancement of data-driven and"
 },
 {
  "id": "mpc-approaches-for-modulating-air-to-water-heat-pumps-in-a87e4c",
  "nodeNumber": "0163",
  "docId": "180",
  "sourceFile": "1-s2.0-S0967066119301820-main.pdf",
  "researcher": "Sebastien Gros",
  "title": "MPC approaches for modulating air-to-water heat pumps in radiant-floor buildings",
  "authors": [
   "Soroush Rastegarpour",
   "Sebastien Gros",
   "Luca Ferrarini"
  ],
  "publicationDate": "2020-03",
  "venue": "Control Engineering Practice",
  "doi": "10.1016/j.conengprac.2019.104209",
  "keywords": [
   "air-to-water heat pump",
   "radiant-floor heating",
   "thermal energy storage",
   "linear time-varying control",
   "nonlinear optimal control",
   "predictive control"
  ],
  "teaser": "A modulating heat pump and water tank result in a nonlinear model due to the load dependency of the heat pump performance, and variable water flows. Nonlinear model predictive control is an effective way to deal with"
 },
 {
  "id": "mpc-based-reinforcement-learning-for-economic-problems-with-8adeb1",
  "nodeNumber": "0164",
  "docId": "190",
  "sourceFile": "2104.02411v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "MPC-based Reinforcement Learning for Economic Problems with Application to Battery Storage",
  "authors": [
   "Arash Bahari Kordabad",
   "Wenqi Cai",
   "Sebastien Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": "10.1109/ACC.2021.9483000",
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "economic optimization",
   "battery storage",
   "policy gradient",
   "bang-bang control"
  ],
  "teaser": "In this paper, we are interested in optimal control problems with purely economic costs, which often yield optimal policies having a (nearly) bang-bang structure. We focus on policy approximations based on Model"
 },
 {
  "id": "mpc4rl-a-software-package-for-reinforcement-learning-based-66ed2d",
  "nodeNumber": "0165",
  "docId": "208",
  "sourceFile": "MPC4RL_-_A_Software_Package_for_Reinforcement_Learning_based_on_Model_Predictive_Control.pdf",
  "researcher": "Sebastien Gros",
  "title": "MPC4RL - A Software Package for Reinforcement Learning based on Model Predictive Control",
  "authors": [
   "Dirk Reinhardt",
   "Katrin Baumgärtner",
   "Jonathan Frey",
   "Moritz Diehl",
   "Sebastien Gros"
  ],
  "publicationDate": "2024-12",
  "venue": "2024 IEEE 63rd Conference on Decision and Control (CDC)",
  "doi": null,
  "keywords": [
   "optimal control",
   "reinforcement learning",
   "model predictive control",
   "software",
   "economic model predictive control",
   "learning"
  ],
  "teaser": "In this paper, we present an early software integrating Reinforcement Learning (RL) with Model Predictive Control (MPC). Our aim is to make recent theoretical contributions from the literature more accessible to both"
 },
 {
  "id": "multi-agent-battery-storage-management-using-mpc-based-4681f6",
  "nodeNumber": "0166",
  "docId": "209",
  "sourceFile": "Multi-agent_Battery_Storage_Management_using_MPC-based_Reinforcement_Learning.pdf",
  "researcher": "Sebastien Gros",
  "title": "Multi-agent Battery Storage Management using MPC-based Reinforcement Learning",
  "authors": [
   "Arash Bahari Kordabad",
   "Wenqi Cai",
   "Sebastien Gros"
  ],
  "publicationDate": "2021-08-08",
  "venue": "2021 IEEE Conference on Control Technology and Applications (CCTA)",
  "doi": null,
  "keywords": [
   "multi-agent systems",
   "battery storage",
   "model predictive control",
   "reinforcement learning",
   "smart grids",
   "optimization"
  ],
  "teaser": "In this paper, we present the use of Model Predictive Control (MPC) based on Reinforcement Learning (RL) to find the optimal policy for a multi-agent battery storage system. A time-varying prediction of the power price"
 },
 {
  "id": "multi-label-video-classification-for-underwater-ship-9ae06a",
  "nodeNumber": "0167",
  "docId": "9",
  "sourceFile": "10.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "Multi-label Video Classification for Underwater Ship Inspection",
  "authors": [
   "Md Abulkalam Azad",
   "Ahmed Mohammed",
   "Maryna Waszak",
   "Brian Elvesæter",
   "Martin Ludvigsen"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "video classification",
   "vision transformer",
   "underwater inspection",
   "deep learning",
   "computer vision",
   "spatiotemporal analysis"
  ],
  "teaser": "Today ship hull inspection including the examination of the external coating, detection of defects, and other types of external degradation such as corrosion and marine growth is conducted underwater by means of"
 },
 {
  "id": "mutual-information-estimation-for-graph-convolutional-2bb144",
  "nodeNumber": "0168",
  "docId": "223",
  "sourceFile": "2203.16887v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Mutual information estimation for graph convolutional neural networks",
  "authors": [
   "Marius C. Landverk",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2022",
  "venue": "Septentrio Academic Publishing",
  "doi": "10.7557/18.6257",
  "keywords": [
   "mutual information",
   "graph neural networks",
   "information plane",
   "deep learning",
   "model evaluation",
   "information bottleneck"
  ],
  "teaser": "Measuring model performance is a key issue for deep learning practitioners. However, we often lack the ability to explain why a specific architecture attains superior predictive accuracy for a given data set. Often,"
 },
 {
  "id": "navigating-digitalization-in-traditional-manufacturing-19c2b2",
  "nodeNumber": "0169",
  "docId": "245",
  "sourceFile": "Buer et al - Navigating digitalization in traditional manufacturing - aligning digital ambition with industrial context.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "Navigating Digitalization in Traditional Manufacturing: Aligning Digital Ambition with Industrial Context",
  "authors": [
   "Sven-Vegard Buer",
   "Jo Wessel Strandhagen",
   "Erik Gran"
  ],
  "publicationDate": "2026",
  "venue": "APMS 2025, IFIP AICT 766",
  "doi": "10.1007/978-3-032-03538-7_13",
  "keywords": [
   "digitalization",
   "industry 4.0",
   "data-driven improvements",
   "use cases",
   "food industry",
   "traditional manufacturing"
  ],
  "teaser": "Although the potential of Industry 4.0 has been widely discussed and demonstrated, manufacturers need appropriate approaches to navigate the opportunities enabled by emerging digital technologies. For most"
 },
 {
  "id": "neural-network-based-model-predictive-control-with-input-to-513e17",
  "nodeNumber": "0170",
  "docId": "52",
  "sourceFile": "Seel_NeuralNetworkBasedModelPredictiveControlWithInputToStateStability2021.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Neural Network-Based Model Predictive Control with Input-to-State Stability",
  "authors": [
   "Katrine Seel",
   "Esten I. Grøtli",
   "Signe Moe",
   "Jan T. Gravdahl",
   "Kristin Y. Pettersen"
  ],
  "publicationDate": "2021-05-25",
  "venue": "2021 American Control Conference (ACC)",
  "doi": "10.23919/ACC50511.2021.9482803",
  "keywords": [
   "model predictive control",
   "neural networks",
   "input-to-state stability",
   "nonlinear systems",
   "learning-based control",
   "continuous stirred tank reactor"
  ],
  "teaser": "Learning-based controllers, and especially learning-based model predictive controllers, have been used for a number of different applications with great success. In spite of good performance, a lot of these cases lack"
 },
 {
  "id": "neural-operator-learning-for-long-time-integration-in-506850",
  "nodeNumber": "0171",
  "docId": "225",
  "sourceFile": "2303.02243v3.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Neural Operator Learning for Long-Time Integration in Dynamical Systems with Recurrent Neural Networks",
  "authors": [
   "Katarzyna Michałowska",
   "Somdatta Goswami",
   "George Em Karniadakis",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2023-03",
  "venue": null,
  "doi": "10.48550/arXiv.2303.02243",
  "keywords": [
   "neural operators",
   "recurrent neural networks",
   "dynamical systems",
   "long-time integration",
   "deep learning",
   "pde"
  ],
  "teaser": "Deep neural networks are an attractive alternative for simulating complex dynamical systems, as in comparison to traditional scientific computing methods, they offer reduced computational costs during inference and can"
 },
 {
  "id": "new-benchmark-instances-for-the-inventory-routing-problem-50c1e8",
  "nodeNumber": "0172",
  "docId": "117",
  "sourceFile": "Skålnes et al (2024) - EJOR.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "New benchmark instances for the inventory routing problem",
  "authors": [
   "Jørgen Skålnes",
   "Mohamed Ben Ahmed",
   "Lars Magnus Hvattum",
   "Magnus Stålhane"
  ],
  "publicationDate": "2024-03",
  "venue": "European Journal of Operational Research",
  "doi": "10.1016/j.ejor.2023.08.010",
  "keywords": [
   "inventory routing problem",
   "benchmark instances",
   "matheuristic",
   "branch-and-cut",
   "vendor-managed inventory",
   "operational research"
  ],
  "teaser": "The existing sets of benchmark instances for the inventory routing problem (IRP) have been beneficial for investigating and illustrating the properties of the problem. However, they possess certain features and design"
 },
 {
  "id": "nondisturbing-extremum-seeking-control-for-multiagent-2a991b",
  "nodeNumber": "0173",
  "docId": "132",
  "sourceFile": "Nondisturbing_Extremum_Seeking_Control_for_Multiagent_Industrial_Systems.pdf",
  "researcher": "Mark_Haring",
  "title": "Nondisturbing Extremum Seeking Control for Multiagent Industrial Systems",
  "authors": [
   "Mark Haring",
   "Synne Fossøy",
   "Thiago Lima Silva",
   "Alexey Pavlov"
  ],
  "publicationDate": "2023-03",
  "venue": "IEEE Transactions on Automatic Control",
  "doi": "10.1109/TAC.2022.3153228",
  "keywords": [
   "distributed systems",
   "dither coordination",
   "extremum seeking control",
   "optimization",
   "perturbation methods",
   "multiagent systems"
  ],
  "teaser": "Industrial applications of extremum seeking control (ESC) can be a hit and miss affair. Although a gain in performance can be achieved, the dither applied to excite the system causes unwanted fluctuations in the"
 },
 {
  "id": "novel-bayesian-framework-for-calibration-of-spatially-64c89e",
  "nodeNumber": "0174",
  "docId": "74",
  "sourceFile": "1-s2.0-S0266352X20302238-main.pdf",
  "researcher": "Ivan_Depina",
  "title": "Novel Bayesian framework for calibration of spatially distributed physical-based landslide prediction models",
  "authors": [
   "Ivan Depina",
   "Emir Ahmet Oguz",
   "Vikas Thakur"
  ],
  "publicationDate": "2020-09",
  "venue": "Computers and Geotechnics",
  "doi": "10.1016/j.compgeo.2020.103660",
  "keywords": [
   "landslide",
   "bayesian",
   "calibration",
   "physical-based",
   "spatial variability",
   "rainfall"
  ],
  "teaser": "This study presents a novel Bayesian framework for statistical calibration of spatially distributed physical-based landslide prediction models. The calibration process is formulated in a statistical setting with the"
 },
 {
  "id": "offline-guarded-safe-reinforcement-learning-for-medical-9cd17a",
  "nodeNumber": "0175",
  "docId": "196",
  "sourceFile": "2505.16242v1-2.pdf",
  "researcher": "Sebastien Gros",
  "title": "Offline Guarded Safe Reinforcement Learning for Medical Treatment Optimization Strategies",
  "authors": [
   "Runze Yan",
   "Xun Shen",
   "Akifumi Wachi",
   "Sebastien Gros",
   "Anni Zhao",
   "Xiao Hu"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "offline reinforcement learning",
   "medical treatment optimization",
   "safe reinforcement learning",
   "out-of-distribution generalization",
   "sepsis treatment",
   "model-based rl"
  ],
  "teaser": "When applying offline reinforcement learning (RL) in healthcare scenarios, the out-of-distribution (OOD) issues pose significant risks, as inappropriate generalization beyond clinical expertise can result in potentially"
 },
 {
  "id": "on-a-time-frequency-blurring-operator-with-applications-in-cf6de7",
  "nodeNumber": "0176",
  "docId": "234",
  "sourceFile": "2.pdf",
  "researcher": "Simon_Halvdansson",
  "title": "On a Time-Frequency Blurring Operator with Applications in Data Augmentation",
  "authors": [
   "Simon Halvdansson"
  ],
  "publicationDate": "2025-05-09",
  "venue": "Journal of Fourier Analysis and Applications",
  "doi": "10.1007/s00041-025-10164-9",
  "keywords": [
   "time-frequency analysis",
   "data augmentation",
   "machine learning",
   "audio preprocessing",
   "short-time fourier transform",
   "spectrogram"
  ],
  "teaser": "Inspired by the success of recent data augmentation methods for signals which act on time-frequency representations, we introduce an operator which convolves the short-time Fourier transform of a signal with a specified"
 },
 {
  "id": "on-model-predictive-path-following-and-trajectory-tracking-733424",
  "nodeNumber": "0177",
  "docId": "44",
  "sourceFile": "Arbo_OnModelPredictivePathFollowingAndTrajectoryTrackingForIndustrialRobots2017.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "On Model Predictive Path Following and Trajectory Tracking for Industrial Robots",
  "authors": [
   "Mathias Hauan Arbo",
   "Esten Ingar Grøtli",
   "Jan Tommy Gravdahl"
  ],
  "publicationDate": "2017-08-20",
  "venue": "2017 13th IEEE Conference on Automation Science and Engineering (CASE)",
  "doi": "10.1109/COASE.2017.8250701",
  "keywords": [
   "model predictive control",
   "path following",
   "trajectory tracking",
   "industrial robots",
   "discretization",
   "real-time systems"
  ],
  "teaser": "In this article the model predictive path following controller and the model predictive trajectory tracking controller are compared for a robotic manipulator. We consider both the Runge-Kutta and collocation based"
 },
 {
  "id": "on-the-stability-bounds-of-kalman-filters-for-linear-190970",
  "nodeNumber": "0178",
  "docId": "133",
  "sourceFile": "On_the_Stability_Bounds_of_Kalman_Filters_for_Linear_Deterministic_Discrete-Time_Systems.pdf",
  "researcher": "Mark_Haring",
  "title": "On the Stability Bounds of Kalman Filters for Linear Deterministic Discrete-Time Systems",
  "authors": [
   "Mark Haring",
   "Tor Arne Johansen"
  ],
  "publicationDate": "2020-10",
  "venue": "IEEE Transactions on Automatic Control",
  "doi": "10.1109/TAC.2020.2966150",
  "keywords": [
   "kalman filter",
   "input-to-state stability",
   "discrete-time systems",
   "cascaded systems",
   "interconnected systems",
   "riccati difference equation"
  ],
  "teaser": "In this article, we prove input-to-state stability of the estimation error of the discrete-time Kalman filter under suitable assumptions. Input-to-state stability is an important prerequisite for the use of many"
 },
 {
  "id": "operationalizing-lean-principles-for-lead-time-reduction-in-d73568",
  "nodeNumber": "0179",
  "docId": "92",
  "sourceFile": "Strandhagen et al. (2018) Operationalizing lean principles for lead time reduction in engineer-to-order (ETO) operations. A case study.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Operationalizing lean principles for lead time reduction in engineer-to-order (ETO) operations: A case study",
  "authors": [
   "Jo W. Strandhagen",
   "Logan R. Vallandingham",
   "Erlend Alfnes",
   "Jan Ola Strandhagen"
  ],
  "publicationDate": "2018",
  "venue": "IFAC PapersOnLine",
  "doi": "10.1016/j.ifacol.2018.08.246",
  "keywords": [
   "engineer-to-order",
   "lean",
   "production management",
   "lead time reduction",
   "production planning and control",
   "business process management"
  ],
  "teaser": "The engineer-to-order (ETO) manufacturing approach is used in companies developing and producing highly customized products. ETO operations include some characteristic business processes such as the sales and tendering"
 },
 {
  "id": "opt-in-transparent-fairness-for-recommender-systems-37fe69",
  "nodeNumber": "0180",
  "docId": "63",
  "sourceFile": "9.pdf",
  "researcher": "Helge_Langseth",
  "title": "Opt-in Transparent Fairness for Recommender Systems",
  "authors": [
   "Bjørnar Vassøy",
   "Benjamin Kille",
   "Helge Langseth"
  ],
  "publicationDate": "2025",
  "venue": "ECIR 2025, LNCS 15572",
  "doi": "10.1007/978-3-031-88708-6_23",
  "keywords": [
   "recommender systems",
   "fairness",
   "transparency",
   "adversarial",
   "vae",
   "user opt-in"
  ],
  "teaser": "Recommender systems serve large, diverse userbases and are subject to fairness concerns. Seminal work on consumer-side fairness in recommender systems tends to focus on mitigating the influence users’ demographic"
 },
 {
  "id": "optimal-coordination-of-automated-vehicles-at-intersections-79643a",
  "nodeNumber": "0181",
  "docId": "213",
  "sourceFile": "POSTPRINT_TCST.2018.2871397.pdf",
  "researcher": "Sebastien Gros",
  "title": "Optimal Coordination of Automated Vehicles at Intersections: Theory and Experiments",
  "authors": [
   "Robert Hult",
   "Mario Zanon",
   "Sébastien Gros",
   "Paolo Falcone"
  ],
  "publicationDate": "2019-11",
  "venue": "IEEE Transactions on Control Systems Technology",
  "doi": "10.1109/TCST.2018.2871397",
  "keywords": [
   "distributed optimization",
   "intersection coordination",
   "model predictive control",
   "networked mobile systems",
   "automated vehicles",
   "collision avoidance"
  ],
  "teaser": "In this paper, we present a bilevel, model predictive controller for coordination of automated vehicles at intersections. The bilevel controller consists of a coordination level, where intersection occupancy timeslots"
 },
 {
  "id": "optimal-energy-trading-with-demand-responses-in-cloud-b362c9",
  "nodeNumber": "0182",
  "docId": "172",
  "sourceFile": "07_Optimal_Energy_Trading_With_Demand_Responses_in_Cloud_Computing_Enabled_Virtual_Power_Plant_in_Smart_Grids.pdf",
  "researcher": "Sabita Maharjan",
  "title": "Optimal Energy Trading With Demand Responses in Cloud Computing Enabled Virtual Power Plant in Smart Grids",
  "authors": [
   "Hwei-Ming Chung",
   "Sabita Maharjan",
   "Yan Zhang",
   "Frank Eliassen",
   "Kai Strunz"
  ],
  "publicationDate": "2022-01",
  "venue": "IEEE Transactions on Cloud Computing",
  "doi": "10.1109/TCC.2021.3118563",
  "keywords": [
   "virtual power plant",
   "cloud energy trading",
   "renewable energy",
   "smart grid",
   "electric vehicles",
   "demand response"
  ],
  "teaser": "The increasing penetration of renewable energy sources and electric vehicles (EVs) poses a significant challenge for the power grid operator in terms of increasing peak load and power quality reduction. Moreover, there"
 },
 {
  "id": "optimal-power-management-of-multi-energy-community-a038c7",
  "nodeNumber": "0183",
  "docId": "211",
  "sourceFile": "Optimal_Power_Management_of_Multi-energy_Community_Considering_The_Local_Energy_Market.pdf",
  "researcher": "Sebastien Gros",
  "title": "Optimal Power Management of Multi-energy Community Considering The Local Energy Market",
  "authors": [
   "Younes Zahraoui",
   "Sebastien Gros",
   "Irina Oleinikova"
  ],
  "publicationDate": null,
  "venue": "IEEE Xplore",
  "doi": null,
  "keywords": [
   "energy management",
   "local energy market",
   "energy transaction",
   "volt/var",
   "energy community",
   "distributed energy resources"
  ],
  "teaser": "This paper proposes a market mechanism that enables the advanced distribution management system (ADMS) for energy trading in the local energy market. Two primary functions of the ADMS are discussed: reducing operational"
 },
 {
  "id": "optimality-conditions-for-model-predictive-control-fb258e",
  "nodeNumber": "0184",
  "docId": "12",
  "sourceFile": "optimality_conditions_for_predictive_models.pdf",
  "researcher": "Akhil S Anand",
  "title": "Optimality Conditions for Model Predictive Control: Rethinking Predictive Model Design",
  "authors": [
   "Akhil S Anand",
   "Arash Bahari Kordabad",
   "Mario Zanon",
   "Sebastien Gros"
  ],
  "publicationDate": "2024-12-25",
  "venue": "Automatica",
  "doi": null,
  "keywords": [
   "mpc",
   "optimal control",
   "markov decision process",
   "system identification",
   "predictive models",
   "economic mpc"
  ],
  "teaser": "Optimality is a critical aspect of Model Predictive Control (MPC), especially in economic MPC. However, achieving optimality in MPC presents significant challenges, and may even be impossible, due to inherent"
 },
 {
  "id": "optimisation-based-coordination-of-connected-automated-4ad941",
  "nodeNumber": "0185",
  "docId": "212",
  "sourceFile": "Optimisation-based coordination of connected  automated vehicles at intersections.pdf",
  "researcher": "Sebastien Gros",
  "title": "Optimisation-based coordination of connected, automated vehicles at intersections",
  "authors": [
   "Robert Hult",
   "Mario Zanon",
   "Sébastien Gros",
   "Henk Wymeersch",
   "Paolo Falcone"
  ],
  "publicationDate": "2020-04-27",
  "venue": "Vehicle System Dynamics",
  "doi": "10.1080/00423114.2020.1755446",
  "keywords": [
   "connected and autonomous vehicles",
   "model predictive control",
   "intelligent transportation systems",
   "intersection coordination",
   "optimisation",
   "traffic management"
  ],
  "teaser": "In this paper, we analyse the performance of a model predictive controller for coordination of connected, automated vehicles at intersections. The problem has combinatorial complexity, and we propose to solve it"
 },
 {
  "id": "optimization-of-the-model-predictive-control-meta-23b2a6",
  "nodeNumber": "0186",
  "docId": "179",
  "sourceFile": "1-s2.0-S0952197623003950-main.pdf",
  "researcher": "Sebastien Gros",
  "title": "Optimization of the model predictive control meta-parameters through reinforcement learning",
  "authors": [
   "Eivind Bøhn",
   "Sebastien Gros",
   "Signe Moe",
   "Tor Arne Johansen"
  ],
  "publicationDate": "2023-03-30",
  "venue": "Engineering Applications of Artificial Intelligence",
  "doi": "10.1016/j.engappai.2023.106211",
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "event-triggered control",
   "linear quadratic regulator",
   "optimization",
   "meta-parameters"
  ],
  "teaser": "Model predictive control (MPC) is increasingly being considered for control of fast systems and embedded applications. However, MPC has some significant challenges for such systems, such as its high computational"
 },
 {
  "id": "optimizing-number-locations-and-types-of-ground-329829",
  "nodeNumber": "0187",
  "docId": "79",
  "sourceFile": "Optimizingnumberlocationsandtypesofgroundinvestigationsforslopestabilityassessmentwithvalueofinformationanalysis.pdf",
  "researcher": "Ivan_Depina",
  "title": "Optimizing number, locations, and types of ground investigations for slope stability assessment with value of information analysis",
  "authors": [
   "Ivan Depina",
   "Knut-Egil Opseth"
  ],
  "publicationDate": "2025-04-14",
  "venue": "Georisk: Assessment and Management of Risk for Engineered Systems and Geohazards",
  "doi": "10.1080/17499518.2025.2488362",
  "keywords": [
   "value of information",
   "slope stability",
   "ground investigation",
   "decision making",
   "geotechnical engineering",
   "uncertainty"
  ],
  "teaser": "This study examines the application of Value of Information (VOI) analysis to identify the optimal number, types, and locations of ground investigations for slope safety assessment. VOI analysis integrates a"
 },
 {
  "id": "optimizing-vessel-fleet-size-and-mix-to-support-maintenance-fcbf0c",
  "nodeNumber": "0188",
  "docId": "119",
  "sourceFile": "Stålhane et al (2019) - EJOR.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "Optimizing vessel fleet size and mix to support maintenance operations at offshore wind farms",
  "authors": [
   "Magnus Stålhane",
   "Elin E. Halvorsen-Weare",
   "Lars Magne Nonås",
   "Giovanni Pantuso"
  ],
  "publicationDate": "2019-01-16",
  "venue": "European Journal of Operational Research",
  "doi": "10.1016/j.ejor.2019.01.023",
  "keywords": [
   "logistics",
   "offshore wind",
   "fleet size and mix",
   "maintenance planning",
   "stochastic programming",
   "matheuristic"
  ],
  "teaser": "This paper considers the problem of determining the optimal vessel fleet to support maintenance operations at an offshore wind farm. We propose a two-stage stochastic programming (SP) model of the problem where the"
 },
 {
  "id": "order-theory-for-discrete-gradient-methods-1bc591",
  "nodeNumber": "0189",
  "docId": "257",
  "sourceFile": "2003.08267v4.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Order theory for discrete gradient methods",
  "authors": [
   "Sølve Eidnes"
  ],
  "publicationDate": "2022-01-15",
  "venue": null,
  "doi": "10.48550/arXiv.2003.08267",
  "keywords": [
   "geometric integration",
   "discrete gradients",
   "energy preservation",
   "b-series",
   "neural networks",
   "high-order methods"
  ],
  "teaser": "The discrete gradient methods are integrators designed to preserve invariants of ordinary differential equations. From a formal series expansion of a subclass of these methods, we derive conditions for arbitrarily high"
 },
 {
  "id": "personalized-dynamic-pricing-policy-for-electric-vehicles-d087b0",
  "nodeNumber": "0190",
  "docId": "181",
  "sourceFile": "1-s2.0-S0968090X24000615-main.pdf",
  "researcher": "Sebastien Gros",
  "title": "Personalized dynamic pricing policy for electric vehicles: Reinforcement learning approach",
  "authors": [
   "Sangjun Bae",
   "Balázs Kulcsár",
   "Sébastien Gros"
  ],
  "publicationDate": "2024-03-04",
  "venue": "Transportation Research Part C",
  "doi": "10.1016/j.trc.2024.104540",
  "keywords": [
   "electric vehicle",
   "fast-electric vehicle charging station",
   "game theory",
   "personalized dynamic pricing",
   "reinforcement learning"
  ],
  "teaser": "With the increasing number of fast-electric vehicle charging stations (fast-EVCSs) and the popularization of information technology, electricity price competition between fast-EVCSs is highly expected, in which the"
 },
 {
  "id": "phasing-the-barriers-to-industry-4-0-bf4fd7",
  "nodeNumber": "0191",
  "docId": "246",
  "sourceFile": "Buer et al - Phasing the barriers to Industry 4.0.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "Phasing the barriers to Industry 4.0",
  "authors": [
   "Sven-Vegard Buer",
   "Pål Furu Kamsvåg",
   "Jo Wessel Strandhagen"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": "10.4324/9781032693415-7",
  "keywords": [
   "industry 4.0",
   "digitalization",
   "barriers",
   "manufacturing",
   "phase-based analysis",
   "digital transformation"
  ],
  "teaser": "This chapter investigates the barriers to Industry 4.0 implementation in manufacturing companies, focusing on how these barriers may vary in relevance across different phases of a digitalization process. While Industry"
 },
 {
  "id": "physics-guided-federated-learning-as-an-enabler-for-digital-c09d15",
  "nodeNumber": "0192",
  "docId": "278",
  "sourceFile": "Stadtmann2024pgf.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Physics-guided federated learning as an enabler for digital twins",
  "authors": [
   "Florian Stadtmann",
   "Erik Rugaard Furevik",
   "Adil Rasheed",
   "Trond Kvamsdal"
  ],
  "publicationDate": "2024-08-22",
  "venue": "Expert Systems With Applications",
  "doi": "10.1016/j.eswa.2024.125169",
  "keywords": [
   "digital twin",
   "federated learning",
   "physics-guided neural network",
   "hybrid modeling",
   "wind turbine",
   "airfoil"
  ],
  "teaser": "Digital twins bring the potential to increase the efficiency of assets, systems, and processes by building virtual replicas through real-time data and modeling. However, data are often confidential and distributed,"
 },
 {
  "id": "physics-guided-machine-learning-using-simplified-theories-5f9a50",
  "nodeNumber": "0193",
  "docId": "274",
  "sourceFile": "Pawar2021pgm.pdf",
  "researcher": "Trond_Kvamsdal",
  "title": "Physics guided machine learning using simplified theories",
  "authors": [
   "Suraj Pawar",
   "Omer San",
   "Burak Aksoylu",
   "Adil Rasheed",
   "Trond Kvamsdal"
  ],
  "publicationDate": "2021-01-08",
  "venue": "Physics of Fluids",
  "doi": "10.1063/5.0038929",
  "keywords": [
   "machine learning",
   "physics-guided models",
   "aerodynamics",
   "fluid dynamics",
   "neural networks",
   "generalizability"
  ],
  "teaser": "Recent applications of machine learning, in particular deep learning, motivate the need to address the generalizability of the statistical inference approaches in physical sciences. In this Letter, we introduce a"
 },
 {
  "id": "potential-for-automated-follow-up-of-safety-equipment-d14f60",
  "nodeNumber": "0194",
  "docId": "123",
  "sourceFile": "APOS-Potential-for-automated-follow-up-of-safety-equipment-signed.pdf",
  "researcher": "Maria_V_Ottermo",
  "title": "Potential for automated follow-up of safety equipment",
  "authors": [
   "Shenae Lee",
   "Maria Vatshaug Ottermo",
   "Stein Hauge",
   "Solfrid Håbrekke",
   "Mary Ann Lundteigen"
  ],
  "publicationDate": "2023-03-10",
  "venue": "SINTEF",
  "doi": null,
  "keywords": [
   "failure detection",
   "failure reporting",
   "failure class determination",
   "technical language processing",
   "safety systems",
   "automation"
  ],
  "teaser": "On petroleum facilities, safety equipment is installed to obtain risk reduction. To ensure that the desired risk reduction is achieved during the operational phase, follow-up of the reliability of such equipment is"
 },
 {
  "id": "predicting-what-matters-training-ai-models-for-better-5d4ce8",
  "nodeNumber": "0195",
  "docId": "17",
  "sourceFile": "Training AI models.pdf",
  "researcher": "Akhil S Anand",
  "title": "Predicting What Matters: Training AI Models for Better Decisions",
  "authors": [
   "Akhil S. Anand",
   "Shambhuraj Sawant",
   "Dirk Peter Reinhardt",
   "Sebastien Gros"
  ],
  "publicationDate": "2025-11-05",
  "venue": "IEEE Transactions on Neural Networks and Learning Systems",
  "doi": "10.1109/TNNLS.2025.3633573",
  "keywords": [
   "markov decision processes",
   "model-based optimization",
   "predictive models",
   "reinforcement learning",
   "sequential decision-making",
   "world models"
  ],
  "teaser": "Artificial intelligence (AI) models that predict the future behavior of real-world systems and processes (also known as predictive AI models) are central to intelligent decision-making. They are often employed in"
 },
 {
  "id": "prediction-intervals-split-normal-mixture-from-quality-64aaac",
  "nodeNumber": "0196",
  "docId": "56",
  "sourceFile": "2.pdf",
  "researcher": "Helge_Langseth",
  "title": "Prediction Intervals: Split Normal Mixture from Quality-Driven Deep Ensembles",
  "authors": [
   "Tarik S. Salem",
   "Helge Langseth",
   "Heri Ramampiaro"
  ],
  "publicationDate": "2020",
  "venue": "Proceedings of the 36th Conference on Uncertainty in Artificial Intelligence (UAI)",
  "doi": null,
  "keywords": [
   "prediction intervals",
   "deep ensembles",
   "uncertainty quantification",
   "split normal mixture",
   "regression",
   "machine learning"
  ],
  "teaser": "Prediction intervals are a machine- and human-interpretable way to represent predictive uncertainty in a regression analysis. In this paper, we present a method for generating prediction intervals along with point"
 },
 {
  "id": "prediction-of-new-onset-migraine-using-clinical-genotypic-db2c99",
  "nodeNumber": "0197",
  "docId": "21",
  "sourceFile": "3.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "Prediction of new-onset migraine using clinical-genotypic data from the HUNT Study: a machine learning analysis",
  "authors": [
   "Fahim Faisal",
   "Antonios Danelakis",
   "Marte-Helene Bjørk",
   "Bendik Winsvold",
   "Manjit Matharu",
   "Parashkev Nachev",
   "Knut Hagen",
   "International Headache Genetics Consortium",
   "Erling Tronvik",
   "Anker Stubberud"
  ],
  "publicationDate": "2025",
  "venue": "The Journal of Headache and Pain",
  "doi": "10.1186/s10194-025-02014-2",
  "keywords": [
   "migraine",
   "machine learning",
   "genetics",
   "clinical data",
   "hunt study",
   "new-onset prediction"
  ],
  "teaser": "Background Migraine is associated with a range of symptoms and comorbid disorders and has a strong genetic basis, but the currently identified risk loci only explain a small portion of the heritability, often termed the"
 },
 {
  "id": "predictions-of-prices-and-volumes-in-the-nordic-balancing-c03170",
  "nodeNumber": "0198",
  "docId": "36",
  "sourceFile": "2.pdf",
  "researcher": "Christian_Andresen",
  "title": "Predictions of Prices and Volumes in the Nordic Balancing Markets for Electricity",
  "authors": [
   "Stian Backe",
   "Signe Riemer-Sørensen",
   "David A. Bordvik",
   "Shweta Tiwari",
   "Christian Andre Andresen"
  ],
  "publicationDate": "2023",
  "venue": "IEEE",
  "doi": "10.1109/ISGT54658.2023.10126900",
  "keywords": [
   "power generation planning",
   "balancing market",
   "machine learning",
   "recurrent neural networks",
   "forecasting",
   "electricity market"
  ],
  "teaser": "The electricity market is driven by complicated interactions that are hard to model analytically. This is particularly the case for the balancing market, where imbalances between supply and demand after the day-ahead"
 },
 {
  "id": "preparing-buildings-for-data-driven-operation-examples-from-427b02",
  "nodeNumber": "0199",
  "docId": "88",
  "sourceFile": "ZEN-Report-69.pdf",
  "researcher": "Johra_Kamilla",
  "title": "PREPARING BUILDINGS FOR DATA-DRIVEN OPERATION Examples from the ZEB Laboratory",
  "authors": [
   "John Clauß",
   "Thomas E. Lassen",
   "Kristian S. Skeie",
   "Kamilla H. Andersen",
   "Luis Caetano",
   "Igor Sartori"
  ],
  "publicationDate": "2024",
  "venue": "ZEN Research Centre",
  "doi": null,
  "keywords": [
   "building automation",
   "energy-flexible buildings",
   "energy efficiency",
   "data-driven building operations",
   "smart buildings",
   "api"
  ],
  "teaser": "This report elaborates on how to prepare buildings for data-driven operation, with a spotlight on the solutions implemented in the ZEB Lab. As buildings evolve into dynamic, data-centric entities, the ability to harness"
 },
 {
  "id": "probabilistic-models-with-deep-neural-networks-deb7b0",
  "nodeNumber": "0200",
  "docId": "57",
  "sourceFile": "3.pdf",
  "researcher": "Helge_Langseth",
  "title": "Probabilistic Models with Deep Neural Networks",
  "authors": [
   "Andrés R. Masegosa",
   "Rafael Cabañas",
   "Helge Langseth",
   "Thomas D. Nielsen",
   "Antonio Salmerón"
  ],
  "publicationDate": "2021-01-18",
  "venue": "Entropy",
  "doi": "10.3390/e23010117",
  "keywords": [
   "deep probabilistic modeling",
   "variational inference",
   "neural networks",
   "latent variable models",
   "bayesian learning",
   "probabilistic graphical models"
  ],
  "teaser": "Recent advances in statistical inference have significantly expanded the toolbox of probabilistic modeling. Historically, probabilistic modeling has been constrained to very restricted model classes, where exact or"
 },
 {
  "id": "ps-devcem-pathology-sensitive-deep-learning-model-for-video-6ea22e",
  "nodeNumber": "0201",
  "docId": "7",
  "sourceFile": "08.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "PS-DeVCEM: Pathology-sensitive deep learning model for video capsule endoscopy based on weakly labeled data",
  "authors": [
   "Ahmed Mohammed",
   "Ivar Farup",
   "Marius Pedersen",
   "Sule Yildirim",
   "Øistein Hovde"
  ],
  "publicationDate": "2020-08-10",
  "venue": "Computer Vision and Image Understanding",
  "doi": "10.1016/j.cviu.2020.103062",
  "keywords": [
   "capsule endoscopy",
   "residual lstm",
   "attention",
   "self-supervision",
   "multiple instance learning",
   "adaptive pooling"
  ],
  "teaser": "We propose a novel pathology-sensitive deep learning model (PS-DeVCEM) for frame-level anomaly detection and multi-label classification of different colon diseases in video capsule endoscopy (VCE) data. Our proposed"
 },
 {
  "id": "pseudo-hamiltonian-neural-networks-for-learning-partial-a4e6cd",
  "nodeNumber": "0202",
  "docId": "259",
  "sourceFile": "2304.14374v3.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Pseudo-Hamiltonian neural networks for learning partial differential equations",
  "authors": [
   "Sølve Eidnes",
   "Kjetil Olsen Lye"
  ],
  "publicationDate": "2024-01-02",
  "venue": null,
  "doi": null,
  "keywords": [
   "pseudo-hamiltonian neural networks",
   "partial differential equations",
   "machine learning",
   "dynamical systems",
   "physics-informed learning",
   "numerical methods"
  ],
  "teaser": "Pseudo-Hamiltonian neural networks (PHNN) were recently introduced for learning dynamical systems that can be modelled by ordinary differential equations. In this paper, we extend the method to partial differential"
 },
 {
  "id": "pseudo-hamiltonian-neural-networks-with-state-dependent-840560",
  "nodeNumber": "0203",
  "docId": "224",
  "sourceFile": "2206.02660v4.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Pseudo-Hamiltonian Neural Networks with State-Dependent External Forces",
  "authors": [
   "Sølve Eidnes",
   "Alexander J. Stasik",
   "Camilla Sterud",
   "Eivind Bøhn",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2023-01-23",
  "venue": null,
  "doi": "10.48550/arXiv.2206.02660",
  "keywords": [
   "pseudo-hamiltonian neural networks",
   "physics informed machine learning",
   "hybrid machine learning",
   "port-hamiltonian systems",
   "state-dependent external forces",
   "numerical integration"
  ],
  "teaser": "Hybrid machine learning based on Hamiltonian formulations has recently been successfully demonstrated for simple mechanical systems, both energy conserving and not energy conserving. We introduce a pseudo-Hamiltonian"
 },
 {
  "id": "pseudo-hamiltonian-neural-networks-with-state-dependent-a5ebbb",
  "nodeNumber": "0204",
  "docId": "258",
  "sourceFile": "2206.02660v4.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Pseudo-Hamiltonian Neural Networks with State-Dependent External Forces",
  "authors": [
   "Sølve Eidnes",
   "Alexander J. Stasik",
   "Camilla Sterud",
   "Eivind Bøhn",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2023-01-23",
  "venue": null,
  "doi": "10.48550/arXiv.2206.02660",
  "keywords": [
   "pseudo-hamiltonian neural networks",
   "physics informed machine learning",
   "hybrid machine learning",
   "hamiltonian systems",
   "state-dependent forces",
   "port-hamiltonian"
  ],
  "teaser": "Hybrid machine learning based on Hamiltonian formulations has recently been successfully demonstrated for simple mechanical systems, both energy conserving and not energy conserving. We introduce a pseudo-Hamiltonian"
 },
 {
  "id": "pseudo-hamiltonian-system-identification-1683c9",
  "nodeNumber": "0205",
  "docId": "260",
  "sourceFile": "2305.06920v2.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "PSEUDO-HAMILTONIAN SYSTEM IDENTIFICATION",
  "authors": [
   "Sigurd Holmsen",
   "Sølve Eidnes",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2023-05",
  "venue": null,
  "doi": "10.48550/arXiv.2305.06920",
  "keywords": [
   "physics-informed machine learning",
   "hybrid modelling",
   "dynamical systems",
   "system identification",
   "pseudo-hamiltonian",
   "numerical integration"
  ],
  "teaser": "Identifying the underlying dynamics of physical systems can be challenging when only provided with observational data. In this work, we consider systems that can be modelled as first-order ordinary differential"
 },
 {
  "id": "pseudo-hamiltonian-system-identification-8f820f",
  "nodeNumber": "0206",
  "docId": "226",
  "sourceFile": "2305.06920v2.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "PSEUDO-HAMILTONIAN SYSTEM IDENTIFICATION",
  "authors": [
   "Sigurd Holmsen",
   "Sølve Eidnes",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2023-05-11",
  "venue": null,
  "doi": "10.48550/arXiv.2305.06920",
  "keywords": [
   "system identification",
   "pseudo-hamiltonian",
   "dynamical systems",
   "physics-informed machine learning",
   "hybrid modeling",
   "numerical integration"
  ],
  "teaser": "Identifying the underlying dynamics of physical systems can be challenging when only provided with observational data. In this work, we consider systems that can be modelled as first-order ordinary differential"
 },
 {
  "id": "psychological-factors-in-the-diffusion-of-sustainable-f0af41",
  "nodeNumber": "0207",
  "docId": "29",
  "sourceFile": "1-s2.0-S1364032111001304-main.pdf",
  "researcher": "Christian Klöckner",
  "title": "Psychological factors in the diffusion of sustainable technology: A study of Norwegian households’ adoption of wood pellet heating",
  "authors": [
   "Bertha Maya Sopha",
   "Christian A. Klöckner"
  ],
  "publicationDate": "2011-06",
  "venue": "Renewable and Sustainable Energy Reviews",
  "doi": "10.1016/j.rser.2011.03.026",
  "keywords": [
   "wood pellet heating",
   "psychological model",
   "technology adoption",
   "path analysis",
   "norwegian households",
   "sustainable technology"
  ],
  "teaser": "This paper aims to understand the determinants of the adoption of wood pellet technology for home heating to identify possible strategies against the slow diffusion of wood pellet in Norway. A mail survey of 737"
 },
 {
  "id": "quantification-of-climate-change-impact-on-rainfall-induced-d4612b",
  "nodeNumber": "0208",
  "docId": "80",
  "sourceFile": "Quantificationofclimatechangeimpactonrainfall-inducedshallowlandslidesusceptibilityacasestudyincentralNorway.pdf",
  "researcher": "Ivan_Depina",
  "title": "Quantification of climate change impact on rainfall-induced shallow landslide susceptibility: a case study in central Norway",
  "authors": [
   "Emir Ahmet Oguz",
   "Rasmus E. Benestad",
   "Kajsa M. Parding",
   "Ivan Depina",
   "Vikas Thakur"
  ],
  "publicationDate": "2024-01-02",
  "venue": "Georisk: Assessment and Management of Risk for Engineered Systems and Geohazards",
  "doi": "10.1080/17499518.2023.2283848",
  "keywords": [
   "landslide susceptibility",
   "rainfall",
   "climate change",
   "intensity-duration-frequency curves",
   "probabilistic approach",
   "norway"
  ],
  "teaser": "Climate change impact on rainfall-induced landslide susceptibility of a certain region is often implied based on expected changes in rainfall patterns and rarely explicitly quantified. This study aims to address this"
 },
 {
  "id": "realizing-lti-models-by-identifying-characteristic-11836b",
  "nodeNumber": "0209",
  "docId": "50",
  "sourceFile": "Nicolai_RealizingLTImodelsByIdentifyingCharacteristicParametersUsingLeastSquaresOptimization2023.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Realizing LTI models by identifying characteristic parameters using least squares optimization",
  "authors": [
   "Tim Nicolai",
   "Mark Haring",
   "Esten I. Grøtli",
   "Jan T. Gravdahl",
   "Johann Reger"
  ],
  "publicationDate": "2023-06",
  "venue": "2023 European Control Conference (ECC)",
  "doi": "10.23919/ECC57620.2023.10217994",
  "keywords": [
   "system identification",
   "subspace identification",
   "linear time-invariant systems",
   "least squares optimization",
   "cayley-hamilton theorem",
   "characteristic parameters"
  ],
  "teaser": "This paper considers the realization of discrete-time linear time-invariant dynamical systems using input-output data. Starting from a generalized state-space representation that accounts for static offsets, a"
 },
 {
  "id": "realizing-lti-models-by-identifying-characteristic-c7daf3",
  "nodeNumber": "0210",
  "docId": "131",
  "sourceFile": "Nicolai_RealizingLTImodelsByIdentifyingCharacteristicParametersUsingLeastSquaresOptimization2023.pdf",
  "researcher": "Mark_Haring",
  "title": "Realizing LTI models by identifying characteristic parameters using least squares optimization",
  "authors": [
   "Tim Nicolai",
   "Mark Haring",
   "Esten I. Grøtli",
   "Jan T. Gravdahl",
   "Johann Reger"
  ],
  "publicationDate": "2023-06",
  "venue": "2023 European Control Conference (ECC)",
  "doi": "10.23919/ECC57627.2023.10238450",
  "keywords": [
   "system identification",
   "linear time-invariant systems",
   "least squares optimization",
   "subspace identification",
   "cayley-hamilton theorem",
   "characteristic parameters"
  ],
  "teaser": "This paper considers the realization of discrete-time linear time-invariant dynamical systems using input-output data. Starting from a generalized state-space representation that accounts for static offsets, a"
 },
 {
  "id": "recency-weighted-temporally-segmented-ensemble-for-time-1ab52d",
  "nodeNumber": "0211",
  "docId": "230",
  "sourceFile": "2403.02150v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Recency-Weighted Temporally-Segmented Ensemble for Time-Series Modeling: Multi-step Forecasting in Process Industries",
  "authors": [
   "Pål V. Johnsen",
   "Eivind Bøhn",
   "Sølve Eidnes",
   "Filippo Remonato",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2024-03-05",
  "venue": null,
  "doi": null,
  "keywords": [
   "time-series forecasting",
   "ensemble learning",
   "process industries",
   "non-stationary data",
   "model predictive control",
   "chunk-based learning"
  ],
  "teaser": "Time-series modeling in process industries faces the challenge of dealing with complex, multifaceted, and evolving data characteristics. Conventional single model approaches often struggle to capture the interplay of"
 },
 {
  "id": "recency-weighted-temporally-segmented-ensemble-for-time-4e8b0d",
  "nodeNumber": "0212",
  "docId": "255",
  "sourceFile": "17572_pub.pdf",
  "researcher": "Sølve_Eidnes",
  "title": "Recency-Weighted Temporally-Segmented Ensemble for Time Series Modeling",
  "authors": [
   "Pål V. B. Johnsen",
   "Eivind Bøhn",
   "Sølve Eidnes",
   "Filippo Remonato",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2025-10",
  "venue": "Journal of Artificial Intelligence Research",
  "doi": "10.1613/jair.1.17572",
  "keywords": [
   "time series forecasting",
   "ensemble learning",
   "process industries",
   "non-stationary data",
   "concept drift",
   "model predictive control"
  ],
  "teaser": "Time series modelling in process industries faces the challenge of dealing with complex, multi-faceted and evolving data characteristics. Conventional single-model approaches often struggle to capture the interplay of"
 },
 {
  "id": "reinforcement-learning-based-mpc-with-neural-dynamical-346970",
  "nodeNumber": "0213",
  "docId": "177",
  "sourceFile": "1-s2.0-S0947358024001080-main.pdf",
  "researcher": "Sebastien Gros",
  "title": "Reinforcement learning based MPC with neural dynamical models",
  "authors": [
   "Saket Adhau",
   "Sébastien Gros",
   "Sigurd Skogestad"
  ],
  "publicationDate": "2024-06-17",
  "venue": "European Journal of Control",
  "doi": "10.1016/j.ejcon.2024.101048",
  "keywords": [
   "reinforcement learning",
   "nonlinear model predictive control",
   "recurrent neural networks",
   "system identification",
   "neural dynamical models",
   "control theory"
  ],
  "teaser": "This paper presents an end-to-end learning approach to developing a Nonlinear Model Predictive Control (NMPC) policy, which does not require an explicit first-principles model and assumes that the system dynamics are"
 },
 {
  "id": "reinforcement-learning-based-on-mpc-and-the-stochastic-6c9d50",
  "nodeNumber": "0214",
  "docId": "205",
  "sourceFile": "ExploAndPolicyGradient_Stochastic_2.pdf",
  "researcher": "Sebastien Gros",
  "title": "Reinforcement Learning based on MPC and the Stochastic Policy Gradient Method",
  "authors": [
   "Sébastien Gros",
   "Mario Zanon"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "policy gradient",
   "actor-critic",
   "stochastic policy",
   "nonlinear programming"
  ],
  "teaser": "In this paper, we present a methodology to implement the stochastic policy gradient method using actor-critic techniques, when the policy is approximated using an MPC scheme. The paper proposes a computationally"
 },
 {
  "id": "reinforcement-learning-based-on-mpc-mhe-for-unmodeled-and-20688b",
  "nodeNumber": "0215",
  "docId": "189",
  "sourceFile": "2103.11871v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Reinforcement Learning based on MPC/MHE for Unmodeled and Partially Observable Dynamics",
  "authors": [
   "Hossein Nejatbakhsh Esfahani",
   "Arash Bahari Kordabad",
   "Sébastien Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": "10.1109/ACCESS.2021.3110000",
  "keywords": [
   "reinforcement learning",
   "model predictive control",
   "moving horizon estimation",
   "pomdp",
   "observer-based control",
   "parameter tuning"
  ],
  "teaser": "This paper proposes an observer-based framework for solving Partially Observable Markov Decision Processes (POMDPs) when an accurate model is not available. We first propose to use a Moving Horizon Estimation-Model"
 },
 {
  "id": "reinforcement-learning-for-mixed-integer-problems-based-on-38c92a",
  "nodeNumber": "0216",
  "docId": "185",
  "sourceFile": "2004.01430v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Reinforcement Learning for Mixed-Integer Problems Based on MPC",
  "authors": [
   "Sebastien Gros",
   "Mario Zanon"
  ],
  "publicationDate": "2020",
  "venue": null,
  "doi": "10.48550/arXiv.2004.01430",
  "keywords": [
   "reinforcement learning",
   "mixed-integer model predictive control",
   "actor-critic methods",
   "policy gradient",
   "stochastic and deterministic policy gradient"
  ],
  "teaser": "Model Predictive Control has been recently proposed as policy approximation for Reinforcement Learning, offering a path towards safe and explainable Reinforcement Learning. This approach has been investigated for"
 },
 {
  "id": "reinforcement-learning-for-mpc-fundamentals-and-current-0e586b",
  "nodeNumber": "0217",
  "docId": "13",
  "sourceFile": "Reinforcement learning and mpc.pdf",
  "researcher": "Akhil S Anand",
  "title": "Reinforcement Learning for MPC: Fundamentals and Current Challenges",
  "authors": [
   "Arash Bahari Kordabad",
   "Dirk Reinhardt",
   "Akhil S Anand",
   "Sebastien Gros"
  ],
  "publicationDate": "2023-01",
  "venue": "IFAC-PapersOnLine",
  "doi": "10.1016/j.ifacol.2023.10.548",
  "keywords": [
   "mpc",
   "reinforcement learning",
   "learning for mpc",
   "stability",
   "safety",
   "control theory"
  ],
  "teaser": "Recent publications have laid a solid theoretical foundation for the combination of Reinforcement Learning and Model Predictive Control, in view of obtaining high-performance data-driven MPC policies. Early practical"
 },
 {
  "id": "reinforcement-learning-for-mpc-fundamentals-and-current-733b32",
  "nodeNumber": "0218",
  "docId": "206",
  "sourceFile": "IFAC2023_RLMPC.pdf",
  "researcher": "Sebastien Gros",
  "title": "Reinforcement Learning for MPC Fundamentals and Current Challenges",
  "authors": [
   "Arash Bahari Kordabad",
   "Dirk Reinhardt",
   "Akhil S Anand",
   "Sebastien Gros"
  ],
  "publicationDate": null,
  "venue": "IFAC",
  "doi": null,
  "keywords": [
   "mpc",
   "reinforcement learning",
   "learning for mpc",
   "stability",
   "safety",
   "control theory"
  ],
  "teaser": "Recent publications have laid a solid theoretical foundation for the combination of Reinforcement Learning and Model Predictive Control, in view of obtaining high-performance data-driven MPC policies. Early practical"
 },
 {
  "id": "reinforcement-learning-of-the-prediction-horizon-in-model-153815",
  "nodeNumber": "0219",
  "docId": "188",
  "sourceFile": "2102.11122v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Reinforcement Learning of the Prediction Horizon in Model Predictive Control",
  "authors": [
   "Eivind Bøhn",
   "Sebastien Gros",
   "Signe Moe",
   "Tor Arne Johansen"
  ],
  "publicationDate": "2021-02-22",
  "venue": null,
  "doi": "10.48550/arXiv.2102.11122",
  "keywords": [
   "adaptive horizon model predictive control",
   "reinforcement learning control",
   "model predictive control",
   "prediction horizon",
   "optimal control",
   "machine learning"
  ],
  "teaser": "Model predictive control (MPC) is a powerful trajectory optimization control technique capable of controlling complex nonlinear systems while respecting system constraints and ensuring safe operation. The MPC’s"
 },
 {
  "id": "relu-networks-as-surrogate-models-in-mixed-integer-linear-590106",
  "nodeNumber": "0220",
  "docId": "64",
  "sourceFile": "2019_ReLU networks as surrogate models in mixed-integer linear programs.pdf",
  "researcher": "Henrik_Andersson",
  "title": "ReLU networks as surrogate models in mixed-integer linear programs",
  "authors": [
   "Bjarne Grimstad",
   "Henrik Andersson"
  ],
  "publicationDate": "2019-09-23",
  "venue": "Computers and Chemical Engineering",
  "doi": "10.1016/j.compchemeng.2019.106580",
  "keywords": [
   "deep neural networks",
   "relu networks",
   "mixed-integer linear programming",
   "surrogate modeling",
   "regression",
   "bound tightening"
  ],
  "teaser": "We consider the embedding of piecewise-linear deep neural networks (ReLU networks) as surrogate models in mixed-integer linear programming (MILP) problems. A MILP formulation of ReLU networks has recently been applied"
 },
 {
  "id": "responsible-artificial-intelligence-governance-a-review-and-3ff733",
  "nodeNumber": "0221",
  "docId": "139",
  "sourceFile": "10.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Responsible artificial intelligence governance: A review and research framework",
  "authors": [
   "Emmanouil Papagiannidis",
   "Patrick Mikalef",
   "Kieran Conboy"
  ],
  "publicationDate": "2025-01-03",
  "venue": "Journal of Strategic Information Systems",
  "doi": "10.1016/j.jsis.2024.101885",
  "keywords": [
   "artificial intelligence",
   "responsible ai governance",
   "governance practices",
   "ai implementation",
   "ai lifecycle"
  ],
  "teaser": "The widespread and rapid diffusion of artificial intelligence (AI) into all types of organizational activities necessitates the ethical and responsible deployment of these technologies. Various national and"
 },
 {
  "id": "rfid-technology-in-the-manufacture-of-customized-drainage-20d3db",
  "nodeNumber": "0222",
  "docId": "89",
  "sourceFile": "Oluyisola et al. (2018) RFId technology in the manufacture of customized drainage and piping systems. A case study.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "RFId technology in the manufacture of customized drainage and piping systems: a case study",
  "authors": [
   "Olumide E. Oluyisola",
   "Jo W. Strandhagen",
   "Sven-Vegard Buer"
  ],
  "publicationDate": "2018",
  "venue": "IFAC PapersOnLine",
  "doi": "10.1016/j.ifacol.2018.08.320",
  "keywords": [
   "rfid",
   "ubiquitous manufacturing",
   "production activity control",
   "manufacturing plant control",
   "logistics in manufacturing",
   "intelligent manufacturing systems"
  ],
  "teaser": "While Radio Frequency Identification (or RFId) technology has gained significant traction in the downstream operations and industries like retail, adoption upstream of the value-chain has been much slower. Few reported"
 },
 {
  "id": "road-graph-generator-mapping-roads-at-construction-sites-621d8f",
  "nodeNumber": "0223",
  "docId": "229",
  "sourceFile": "2402.09919v4.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Road Graph Generator: Mapping roads at construction sites from GPS data",
  "authors": [
   "Katarzyna Michałowska",
   "Helga Margrete Bodahl Holmestad",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2024-02-15",
  "venue": null,
  "doi": "10.48550/arXiv.2402.09919",
  "keywords": [
   "road inference",
   "gps trajectory",
   "spatial graph detection",
   "trajectory alignment",
   "construction sites",
   "graph modeling"
  ],
  "teaser": "We propose a new method for inferring roads from GPS trajectories to map construction sites. This task presents a unique challenge due to the erratic and nonstandard movement patterns of construction machinery, which"
 },
 {
  "id": "safe-learning-for-control-using-control-lyapunov-functions-5af3ff",
  "nodeNumber": "0224",
  "docId": "15",
  "sourceFile": "safe_reinforcement_learning.pdf",
  "researcher": "Akhil S Anand",
  "title": "Safe Learning for Control using Control Lyapunov Functions and Control Barrier Functions: A Review",
  "authors": [
   "Akhil Anand",
   "Katrine Seel",
   "Vilde Gjærum",
   "Anne Håkansson",
   "Haakon Robinson",
   "Aya Saad"
  ],
  "publicationDate": "2021",
  "venue": "Procedia Computer Science",
  "doi": "10.1016/j.procs.2021.09.173",
  "keywords": [
   "safe learning",
   "control barrier functions",
   "control lyapunov functions",
   "reinforcement learning",
   "safety-critical systems",
   "robust control"
  ],
  "teaser": "Real-world autonomous systems are often controlled using conventional model-based control methods. But if accurate models of a system are not available, these methods may be unsuitable. For many safety-critical systems,"
 },
 {
  "id": "safe-reinforcement-learning-using-action-projection-0a31fa",
  "nodeNumber": "0225",
  "docId": "198",
  "sourceFile": "2509.12833v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Safe Reinforcement Learning using Action Projection: Safeguard the Policy or the Environment?",
  "authors": [
   "Hannah Markgraf",
   "Shamburaj Sawant",
   "Hanna Krasowski",
   "Lukas Schäfer",
   "Sebastien Gros",
   "Matthias Althoff"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "safe reinforcement learning",
   "action projection",
   "safety filters",
   "policy gradients",
   "action aliasing",
   "actor-critic"
  ],
  "teaser": "Projection-based safety filters, which modify unsafe actions by mapping them to the closest safe alternative, are widely used to enforce safety constraints in reinforcement learning (RL). Two integration strategies are"
 },
 {
  "id": "safe-reinforcement-learning-using-robust-mpc-b75140",
  "nodeNumber": "0226",
  "docId": "183",
  "sourceFile": "1906.04005v2.pdf",
  "researcher": "Sebastien Gros",
  "title": "Safe Reinforcement Learning Using Robust MPC",
  "authors": [
   "Mario Zanon",
   "Sébastien Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": "10.1109/TAC.2020.3005631",
  "keywords": [
   "reinforcement learning",
   "robust model predictive control",
   "safe policies",
   "control systems",
   "optimization",
   "safety constraints"
  ],
  "teaser": "Reinforcement Learning (RL) has recently impressed the world with stunning results in various applications. While the potential of RL is now well-established, many critical aspects still need to be tackled, including"
 },
 {
  "id": "safe-reinforcement-learning-using-wasserstein-24ac45",
  "nodeNumber": "0227",
  "docId": "215",
  "sourceFile": "Safe_Reinforcement_Learning_Using_Wasserstein_Distributionally_Robust_MPC_and_Chance_Constraint.pdf",
  "researcher": "Sebastien Gros",
  "title": "Safe Reinforcement Learning Using Wasserstein Distributionally Robust MPC and Chance Constraint",
  "authors": [
   "Arash Bahari Kordabad",
   "Rafael Wisniewski",
   "Sebastien Gros"
  ],
  "publicationDate": "2022-12-12",
  "venue": "IEEE Access",
  "doi": "10.1109/ACCESS.2022.3228922",
  "keywords": [
   "safe reinforcement learning",
   "model predictive control",
   "distributionally robust optimization",
   "chance constraint",
   "conditional value at risk",
   "q-learning"
  ],
  "teaser": "In this paper, we address the chance-constrained safe Reinforcement Learning (RL) problem using the function approximators based on Stochastic Model Predictive Control (SMPC) and Distributionally Robust Model Predictive"
 },
 {
  "id": "safe-reinforcement-learning-via-projection-on-a-safe-set-695f31",
  "nodeNumber": "0228",
  "docId": "184",
  "sourceFile": "2004.00915v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Safe Reinforcement Learning via Projection on a Safe Set: How to Achieve Optimality?",
  "authors": [
   "Sebastien Gros",
   "Mario Zanon",
   "Alberto Bemporad"
  ],
  "publicationDate": "2020",
  "venue": null,
  "doi": "10.48550/arXiv.2004.00915",
  "keywords": [
   "safe reinforcement learning",
   "safe projection",
   "robust mpc",
   "q-learning",
   "policy gradient",
   "actor-critic"
  ],
  "teaser": "For all its successes, Reinforcement Learning (RL) still struggles to deliver formal guarantees on the closed-loop behavior of the learned policy. Among other things, guaranteeing the safety of RL with respect to"
 },
 {
  "id": "safesub-safe-and-autonomous-subsea-intervention-08ba7c",
  "nodeNumber": "0229",
  "docId": "4",
  "sourceFile": "05.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "SAFESUB: Safe and Autonomous Subsea Intervention",
  "authors": [
   "Aksel A. Transeth",
   "Jostein Thorstensen",
   "Ahmed Mohammed",
   "Jens T. Thielemann",
   "Klaus Ening",
   "Esten Ingar Grøtli",
   "Bent O.A. Haugaløkken",
   "Martin Albertsen Brandt",
   "Ments Tore Møller",
   "Rebecca Petterteig Hovland",
   "Odd Steinar Erland",
   "Ingrid Bouwer Utne",
   "Ingrid Schjølberg"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "autonomous robotics",
   "subsea intervention",
   "uncertainty quantification",
   "underwater vehicles",
   "sensing",
   "perception"
  ],
  "teaser": "The demand for autonomous robotic solutions capable of operating in complex and dangerous environments – such as those found in inspection and maintenance (I&M) operations – is growing. However, the success of"
 },
 {
  "id": "sampling-based-3d-aerial-inspection-path-planning-da8b21",
  "nodeNumber": "0230",
  "docId": "46",
  "sourceFile": "Brandt_SamplingBased3DAerialInspectionPathPlanning2025.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Sampling-Based 3D Aerial Inspection Path Planning",
  "authors": [
   "Martin Albertsen Brandt",
   "Esten Ingar Grøtli"
  ],
  "publicationDate": "2025-06-10",
  "venue": "2025 33rd Mediterranean Conference on Control and Automation (MED)",
  "doi": null,
  "keywords": [
   "uav",
   "inspection",
   "path planning",
   "coverage",
   "rrt*",
   "3d modeling"
  ],
  "teaser": "This article presents a coverage path planning pipeline for inspection of complex structures in 3D using unmanned aerial vehicles (UAVs). The approach generates candidate view points through random sampling of an input"
 },
 {
  "id": "scheduling-and-routing-of-automated-guided-vehicles-agvs-in-e385a3",
  "nodeNumber": "0231",
  "docId": "241",
  "sourceFile": "7.pdf",
  "researcher": "Steffen_Bakker",
  "title": "Scheduling and routing of automated guided vehicles (AGVs) in container terminals: case study of Norwegian ports",
  "authors": [
   "Mohamed Ben Ahmed",
   "Kjetil Fagerholt",
   "Steffen J.S. Bakker",
   "Yauheni Kisialiou"
  ],
  "publicationDate": "2025-10-12",
  "venue": null,
  "doi": null,
  "keywords": [
   "time-space network",
   "pick-up and delivery",
   "time windows",
   "matheuristic",
   "restrict-and-fix",
   "container terminals"
  ],
  "teaser": "Automation in container terminals has become increasingly critical in response to the surging global trade volumes and the demand for enhanced operational efficiency. This work focuses on the applications of AGVs in"
 },
 {
  "id": "security-orchestration-with-explainability-for-digital-c63cb6",
  "nodeNumber": "0232",
  "docId": "163",
  "sourceFile": "Security Orchestration with Explainability for Digital Twins-based Smart Systems.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Security Orchestration with Explainability for Digital Twins-based Smart Systems",
  "authors": [
   "Minh-Tri Nguyen",
   "An Ngoc Lam",
   "Phu Nguyen",
   "Hong-Linh Truong"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "security orchestration",
   "digital twin",
   "smart iot systems",
   "machine learning",
   "explainability"
  ],
  "teaser": "The Digital Twin (DT) paradigm has been largely adopted for many smart systems in various domains. Due to the heterogeneous and distributed nature of the physical twins, these systems increasingly incorporate disparate"
 },
 {
  "id": "semi-cyclic-rostering-of-ranked-surgeons-a-real-life-case-928ab6",
  "nodeNumber": "0233",
  "docId": "67",
  "sourceFile": "2021_Semi-cyclic rostering of ranked surgeons — A real-life case with stability and flexibility measures.pdf",
  "researcher": "Henrik_Andersson",
  "title": "Semi-cyclic rostering of ranked surgeons — A real-life case with stability and flexibility measures",
  "authors": [
   "Kjartan Kastet Klyve",
   "Henrik Andersson",
   "Anders N. Gullhav",
   "Birger Henning Endreseth"
  ],
  "publicationDate": "2021-02-17",
  "venue": "Operations Research for Health Care",
  "doi": "10.1016/j.orhc.2021.100286",
  "keywords": [
   "physician rostering",
   "semi-cyclic rostering",
   "shadow shifts",
   "matheuristic",
   "residency",
   "healthcare operations"
  ],
  "teaser": "We consider the rostering problem for surgeons in residency at the Clinic of Surgery at St. Olav’s Hospital, Trondheim University Hospital, in Trondheim, Norway. Each surgeon in residency has a rank depending on"
 },
 {
  "id": "sensor-guided-motions-for-manipulators-in-manufacturing-1214f0",
  "nodeNumber": "0234",
  "docId": "48",
  "sourceFile": "Grøtli_SensorGuidedMotionsForManipulatorsInManufacturing2024.pdf",
  "researcher": "EstenIngar_Grøtli",
  "title": "Sensor-guided motions for manipulators in manufacturing",
  "authors": [
   "Esten Ingar Grøtli",
   "Martin Albertsen Brandt",
   "Mathias Hauan Arbo",
   "Ingrid Fjordheim Onstein",
   "Ahmed Mohammed",
   "Jan Tommy Gravdahl"
  ],
  "publicationDate": "2024",
  "venue": "Routledge",
  "doi": "10.4324/9781032693415-14",
  "keywords": [
   "robotics",
   "manipulators",
   "sensor-guided motion",
   "manufacturing",
   "automation",
   "industrial applications"
  ],
  "teaser": "Industrial manipulator arms have traditionally been used for highly repetitive tasks due to their excellent precision, speed and endurance. Today, manufacturing faces higher demands in meeting increased customization,"
 },
 {
  "id": "sequencing-the-production-of-mass-customized-walls-347f9b",
  "nodeNumber": "0235",
  "docId": "247",
  "sourceFile": "Buer et al - Sequencing the production of mass customized walls.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "SEQUENCING THE PRODUCTION OF MASS CUSTOMIZED WALLS",
  "authors": [
   "Sven-Vegard Buer",
   "Lars Skjelstad",
   "Jo Wessel Strandhagen"
  ],
  "publicationDate": "2024-09-25",
  "venue": "11th International Conference on Customization and Personalization (MCP 2024)",
  "doi": null,
  "keywords": [
   "simulation",
   "sequencing of jobs",
   "optimization of throughput",
   "mass customization",
   "prefabrication",
   "production line"
  ],
  "teaser": "House building has moved indoors, into factories that mass produce flooring, walls, and roofs in dry and controlled environments. Since projects differ, and sections of the same house differ, the production system"
 },
 {
  "id": "simultaneous-constraints-on-the-number-and-mass-of-2430fe",
  "nodeNumber": "0236",
  "docId": "216",
  "sourceFile": "1210.2131v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "SIMULTANEOUS CONSTRAINTS ON THE NUMBER AND MASS OF RELATIVISTIC SPECIES",
  "authors": [
   "David Parkinson",
   "Tamara M. Davis"
  ],
  "publicationDate": "2012-10",
  "venue": "The Astrophysical Journal",
  "doi": "10.1088/0004-637X/760/1/2",
  "keywords": [
   "cosmology",
   "neutrinos",
   "cosmic microwave background",
   "large scale structure",
   "dark radiation",
   "neutrino mass"
  ],
  "teaser": "Recent indications from both particle physics and cosmology suggest the existence of more than three neutrino species. In cosmological analyses the effects of neutrino mass and number of species can in principle be"
 },
 {
  "id": "stram-a-strategic-network-design-model-for-national-freight-804e86",
  "nodeNumber": "0237",
  "docId": "238",
  "sourceFile": "4.pdf",
  "researcher": "Steffen_Bakker",
  "title": "STraM: A strategic network design model for national freight transport decarbonization",
  "authors": [
   "Steffen J.S. Bakker",
   "Jonas Martin",
   "E. Ruben van Beesten",
   "Ingvild Synnøve Brynildsen",
   "Anette Sandvig",
   "Marit Siqveland",
   "Antonia Golab"
  ],
  "publicationDate": "2025-03-24",
  "venue": "Transportation Research Part E",
  "doi": "10.1016/j.tre.2025.104076",
  "keywords": [
   "national freight transport",
   "decarbonization",
   "network design modeling",
   "long-term uncertainty",
   "transport infrastructure investment",
   "stochastic programming"
  ],
  "teaser": "National freight transport models are valuable tools for assessing the impact of various policies and investments on achieving decarbonization targets under different future scenarios. However, these models struggle to"
 },
 {
  "id": "sustainability-challenges-and-how-industry-4-0-technologies-6728cb",
  "nodeNumber": "0238",
  "docId": "95",
  "sourceFile": "Strandhagen et al. (2022) Sustainability challenges and how Industry 4.0 technologies can address them  a case study of a shipbuilding supply chain.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Sustainability challenges and how Industry 4.0 technologies can address them: a case study of a shipbuilding supply chain",
  "authors": [
   "Jo Wessel Strandhagen",
   "Sven-Vegard Buer",
   "Marco Semini",
   "Erlend Alfnes",
   "Jan Ola Strandhagen"
  ],
  "publicationDate": "2020-10-28",
  "venue": "Production Planning & Control",
  "doi": "10.1080/09537287.2020.1837940",
  "keywords": [
   "engineer-to-order manufacturing",
   "shipbuilding",
   "digitalization",
   "industry 4.0",
   "sustainability"
  ],
  "teaser": "The shipbuilding industry is under significant economic pressure and in need of more efficient solutions to secure economically sustainable operations. It is also challenged by social issues and the need for a greener"
 },
 {
  "id": "synthesis-of-model-predictive-control-and-reinforcement-2d2364",
  "nodeNumber": "0239",
  "docId": "193",
  "sourceFile": "2502.02133v1.pdf",
  "researcher": "Sebastien Gros",
  "title": "Synthesis of Model Predictive Control and Reinforcement Learning: Survey and Classification",
  "authors": [
   "Rudolf Reiter",
   "Jasper Hoffmann",
   "Dirk Reinhardt",
   "Florian Messerer",
   "Katrin Baumgärtner",
   "Shambhuraj Sawant",
   "Joschka Boedecker",
   "Moritz Diehl",
   "Sébastien Gros"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "model predictive control",
   "reinforcement learning",
   "optimal control",
   "survey",
   "classification",
   "markov decision processes"
  ],
  "teaser": "The fields of model predictive control (MPC) and reinforcement learning (RL) consider two successful control techniques for Markov decision processes. Both approaches are derived from similar fundamental principles, and"
 },
 {
  "id": "task-complexity-what-challenges-the-crew-and-how-do-they-acc00a",
  "nodeNumber": "0240",
  "docId": "153",
  "sourceFile": "Braarud-Kirwan-2011_Task Complexity What Challenges the Crew and How Do They Cope_Chapter.pdf",
  "researcher": "Per_Oivind_Braarud",
  "title": "Task Complexity: What Challenges the Crew and How Do They Cope",
  "authors": [
   "Per Øivind Braarud",
   "Barry Kirwan"
  ],
  "publicationDate": "2011",
  "venue": "Simulator-based Human Factors Studies Across 25 Years",
  "doi": "10.1007/978-0-85729-003-8_15",
  "keywords": [
   "task complexity",
   "nuclear process control",
   "crew performance",
   "human factors",
   "safety analysis",
   "diagnostic behaviour"
  ],
  "teaser": "What makes tasks complex for the control room crew, how can complex tasks be described, and how does the crew cope with complex scenarios? These questions are of basic interest to nuclear process control. The work"
 },
 {
  "id": "temporal-granularity-and-charging-strategies-in-time-574aca",
  "nodeNumber": "0241",
  "docId": "239",
  "sourceFile": "5.pdf",
  "researcher": "Steffen_Bakker",
  "title": "Temporal Granularity and Charging Strategies in Time-Dependent Electric Vehicle Routing",
  "authors": [
   "Mostafa Mohammadi",
   "Golman Rahmanifar",
   "Steffen J.S. Bakker",
   "Tom Van Woensel",
   "Mostafa Hajiaghaei-Keshteli"
  ],
  "publicationDate": "2025-08-26",
  "venue": "SSRN",
  "doi": null,
  "keywords": [
   "electric vehicle routing problem",
   "time-dependent travel time",
   "metaheuristic",
   "partial recharging",
   "temporal granularity",
   "urban logistics"
  ],
  "teaser": "This study addresses the Time-Dependent Electric Vehicle Routing Problem with Partial Recharging (TDEVRP-PR), an extension of the classical EVRP that accounts for segmented time-dependent travel times and partial"
 },
 {
  "id": "testing-topological-data-analysis-for-condition-monitoring-8f10a9",
  "nodeNumber": "0242",
  "docId": "231",
  "sourceFile": "2406.16380v1.pdf",
  "researcher": "Signe_Riemer-Sorensen",
  "title": "Testing Topological Data Analysis for Condition Monitoring of Wind Turbines",
  "authors": [
   "Simone Casolo",
   "Alexander Johannes Stasik",
   "Zhenyou Zhang",
   "Signe Riemer-Sørensen"
  ],
  "publicationDate": "2024",
  "venue": "European Conference of the Prognostics and Health Management Society 2024",
  "doi": null,
  "keywords": [
   "topological data analysis",
   "condition monitoring",
   "wind turbines",
   "vibration analysis",
   "fault detection",
   "persistent homology"
  ],
  "teaser": "We present an investigation of how topological data analysis (TDA) can be applied to condition-based monitoring (CBM) of wind turbines for energy generation. TDA is a branch of data analysis focusing on extracting"
 },
 {
  "id": "the-application-of-flow-diagnostics-for-reservoir-management-fb8f9c",
  "nodeNumber": "0243",
  "docId": "104",
  "sourceFile": "spe-171557-pa.pdf",
  "researcher": "Knut-Andreas Lie",
  "title": "The Application of Flow Diagnostics for Reservoir Management",
  "authors": [
   "Olav Møyner",
   "Stein Krogstad",
   "Knut-Andreas Lie"
  ],
  "publicationDate": "2015-04",
  "venue": "SPE Journal",
  "doi": "10.2118/171557-PA",
  "keywords": [
   "reservoir management",
   "flow diagnostics",
   "time of flight",
   "optimization",
   "finite-volume methods",
   "adjoint methods"
  ],
  "teaser": "Flow diagnostics, as referred to herein, are computational tools derived from controlled numerical flow experiments that yield quantitative information regarding the flow behavior of a reservoir model in settings much"
 },
 {
  "id": "the-complementary-effect-of-lean-manufacturing-and-607fed",
  "nodeNumber": "0244",
  "docId": "248",
  "sourceFile": "Buer et al - The complementary effect of lean manufacturing and digitalisation on operational performance.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "The complementary effect of lean manufacturing and digitalisation on operational performance",
  "authors": [
   "Sven-Vegard Buer",
   "Marco Semini",
   "Jan Ola Strandhagen",
   "Fabio Sgarbossa"
  ],
  "publicationDate": "2021-04-03",
  "venue": "International Journal of Production Research",
  "doi": "10.1080/00207543.2020.1790684",
  "keywords": [
   "lean manufacturing",
   "digitalisation",
   "industry 4.0",
   "smart manufacturing",
   "operational performance"
  ],
  "teaser": "The most recent trend manufacturers have embraced to seek operational performance improvements is the use of a wide range of digital technologies typically associated with Industry 4.0. However, few studies have"
 },
 {
  "id": "the-data-driven-process-improvement-cycle-using-39b577",
  "nodeNumber": "0245",
  "docId": "249",
  "sourceFile": "Buer et al - The data-driven process improvement cycle - using digitalization for continuous improvement.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "The Data-Driven Process Improvement Cycle: Using Digitalization for Continuous Improvement",
  "authors": [
   "Sven-Vegard Buer",
   "Giuseppe Ismael Fragapane",
   "Jan Ola Strandhagen"
  ],
  "publicationDate": "2018",
  "venue": "IFAC PapersOnLine",
  "doi": "10.1016/j.ifacol.2018.08.471",
  "keywords": [
   "digitalization",
   "digitization",
   "industry 4.0",
   "improvement cycle",
   "lean manufacturing",
   "continuous improvement"
  ],
  "teaser": "Industry 4.0 is the first industrial revolution to be announced a priori, and there is thus a significant ambiguity surrounding the term and what it actually entails. This paper aims to clearly define digitalization, a"
 },
 {
  "id": "the-digitalization-of-manufacturing-investigating-the-cd44f0",
  "nodeNumber": "0246",
  "docId": "250",
  "sourceFile": "Buer et al - The digitalization of manufacturing - investigating the impact of production environment and company size.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "The digitalization of manufacturing: investigating the impact of production environment and company size",
  "authors": [
   "Sven-Vegard Buer",
   "Jo Wessel Strandhagen",
   "Marco Semini",
   "Jan Ola Strandhagen"
  ],
  "publicationDate": "2020-07-29",
  "venue": "Journal of Manufacturing Technology Management",
  "doi": "10.1108/JMTM-05-2019-0174",
  "keywords": [
   "digitalization",
   "industry 4.0",
   "digital technologies",
   "production environments",
   "survey",
   "manufacturing"
  ],
  "teaser": "Purpose – While manufacturing digitalization is currently considered an important enabler of competitive advantage, its applicability across the industrial spectrum is unclear. This paper aims to investigate the"
 },
 {
  "id": "the-dynamic-electric-carsharing-relocation-problem-6f363b",
  "nodeNumber": "0247",
  "docId": "68",
  "sourceFile": "2021_The dynamic electric carsharing relocation problem.pdf",
  "researcher": "Henrik_Andersson",
  "title": "The Dynamic Electric Carsharing Relocation Problem",
  "authors": [
   "Simen Hellem",
   "Carl Andreas Julsvoll",
   "Magnus Moan",
   "Henrik Andersson",
   "Kjetil Fagerholt",
   "Giovanni Pantuso"
  ],
  "publicationDate": "2021-11-19",
  "venue": "EURO Journal on Transportation and Logistics",
  "doi": "10.1016/j.ejtl.2021.100055",
  "keywords": [
   "carsharing",
   "urban mobility",
   "dynamic routing",
   "adaptive large neighborhood search",
   "electric vehicles",
   "operations research"
  ],
  "teaser": "This article addresses a relocation and recharging problem faced by modern carsharing operators who manage a fleet of electric vehicles. As customers utilize the fleet, batteries are depleted and vehicles are possibly"
 },
 {
  "id": "the-emerging-clinical-relevance-of-artificial-intelligence-d3858d",
  "nodeNumber": "0248",
  "docId": "18",
  "sourceFile": "1.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "The Emerging Clinical Relevance of Artificial Intelligence, Data Science, and Wearable Devices in Headache: A Narrative Review",
  "authors": [
   "Antonios Danelakis",
   "Anker Stubberud",
   "Erling Tronvik",
   "Manjit Matharu"
  ],
  "publicationDate": "2025-06-04",
  "venue": "Life",
  "doi": "10.3390/life15060909",
  "keywords": [
   "artificial intelligence",
   "machine learning",
   "data science",
   "wearable devices",
   "headache",
   "clinical relevance"
  ],
  "teaser": "This narrative review introduces key concepts in artificial intelligence (AI), data science, and wearable devices aimed at headache clinicians and researchers. PubMed and IEEEXplore were searched to identify relevant"
 },
 {
  "id": "the-fit-of-industry-4-0-applications-in-manufacturing-7e551d",
  "nodeNumber": "0249",
  "docId": "91",
  "sourceFile": "Strandhagen et al. (2017) The fit of Industry 4.0 applications in manufacturing logistics. A multiple case study.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "The fit of Industry 4.0 applications in manufacturing logistics: a multiple case study",
  "authors": [
   "Jo Wessel Strandhagen",
   "Erlend Alfnes",
   "Jan Ola Strandhagen",
   "Logan Reed Vallandingham"
  ],
  "publicationDate": "2017-11-08",
  "venue": "Advanced Manufacturing",
  "doi": "10.1007/s40436-017-0200-y",
  "keywords": [
   "industry 4.0",
   "manufacturing logistics",
   "production planning and control",
   "production environment",
   "case study",
   "cyber-physical systems"
  ],
  "teaser": "The fourth industrial revolution, Industry 4.0, is expected to cause disruptive changes in industrial production. It is driven by rapid technological developments and the need for manufacturing companies to make"
 },
 {
  "id": "the-link-between-industry-4-0-and-lean-manufacturing-be4cd6",
  "nodeNumber": "0250",
  "docId": "251",
  "sourceFile": "Buer et al - The link between Industry 4.0 and lean manufacturing - mapping current research and establishing a research agenda.pdf",
  "researcher": "Sven-Vegard_Buer",
  "title": "The link between Industry 4.0 and lean manufacturing: mapping current research and establishing a research agenda",
  "authors": [
   "Sven-Vegard Buer",
   "Jan Ola Strandhagen",
   "Felix T. S. Chan"
  ],
  "publicationDate": "2018-03-02",
  "venue": "International Journal of Production Research",
  "doi": "10.1080/00207543.2018.1442945",
  "keywords": [
   "industry 4.0",
   "smart manufacturing",
   "lean manufacturing",
   "cyber-physical systems",
   "internet of things",
   "literature review"
  ],
  "teaser": "In recent years, Industry 4.0 has emerged as one of the most discussed concepts and has gained significant popularity in both academia and the industrial sector. Both Industry 4.0 and lean manufacturing utilise"
 },
 {
  "id": "the-multiquadric-kernel-for-moment-matching-distributional-e1bacd",
  "nodeNumber": "0251",
  "docId": "59",
  "sourceFile": "5.pdf",
  "researcher": "Helge_Langseth",
  "title": "The Multiquadric Kernel for Moment-Matching Distributional Reinforcement Learning",
  "authors": [
   "Ludvig Killingberg",
   "Helge Langseth"
  ],
  "publicationDate": "2023-08",
  "venue": "Transactions on Machine Learning Research",
  "doi": null,
  "keywords": [
   "reinforcement learning",
   "distributional reinforcement learning",
   "moment matching",
   "multiquadric kernel",
   "bellman operator",
   "machine learning"
  ],
  "teaser": "Distributional reinforcement learning has gained significant attention in recent years due to its ability to handle uncertainty and variability in the returns an agent will receive for each action it takes. A key"
 },
 {
  "id": "the-multistage-stochastic-vehicle-routing-problem-with-628390",
  "nodeNumber": "0252",
  "docId": "65",
  "sourceFile": "2020_The multistage stochastic vehicle routing problem with dynamic occational drivers.pdf",
  "researcher": "Henrik_Andersson",
  "title": "The Multistage Stochastic Vehicle Routing Problem with Dynamic Occasional Drivers",
  "authors": [
   "Jørgen Skålnes",
   "Lars Dahle",
   "Henrik Andersson",
   "Marielle Christiansen",
   "Lars Magnus Hvattum"
  ],
  "publicationDate": "2020",
  "venue": "International Conference on Computational Logistics (ICCL 2020), Lecture Notes in Computer Science (LNCS 12433)",
  "doi": "10.1007/978-3-030-59747-4_17",
  "keywords": [
   "stochastic programming",
   "uncertainty",
   "crowdshipping",
   "mixed-integer programming",
   "vehicle routing",
   "dynamic drivers"
  ],
  "teaser": "Widespread use of smart phones and cellular networks allow for new solutions to lower the costs of last mile delivery to customers. We consider a setting where a company not only uses its own fleet of vehicles to"
 },
 {
  "id": "the-psychology-of-pro-environmental-communication-beyond-5c744e",
  "nodeNumber": "0253",
  "docId": "31",
  "sourceFile": "Klöckner_2015.pdf",
  "researcher": "Christian Klöckner",
  "title": "The Psychology of Pro-Environmental Communication: Beyond Standard Information Strategies",
  "authors": [
   "Christian A. Klöckner"
  ],
  "publicationDate": "2015",
  "venue": "Palgrave Macmillan",
  "doi": "10.1007/978-1-137-34832-6",
  "keywords": [
   "environmental communication",
   "pro-environmental behavior",
   "social psychology",
   "sustainability",
   "communication theory",
   "behavioral models"
  ],
  "teaser": "This book explores the psychological underpinnings of pro-environmental communication, moving beyond traditional information-based strategies. It examines how communication can effectively promote sustainable behavior"
 },
 {
  "id": "the-representation-of-hydrogen-in-open-source-capacity-4cf356",
  "nodeNumber": "0254",
  "docId": "35",
  "sourceFile": "12.pdf",
  "researcher": "Christian_Andresen",
  "title": "The representation of hydrogen in open-source capacity expansion models",
  "authors": [
   "Dana Reulein",
   "Herib Blanco",
   "Dimitri Pinel",
   "Hossein Farahmand",
   "Christian Andre Andresen"
  ],
  "publicationDate": "2025-01",
  "venue": "International Journal of Hydrogen Energy",
  "doi": "10.1016/j.ijhydene.2024.11.436",
  "keywords": [
   "hydrogen",
   "energy system planning",
   "optimization",
   "variable renewable energy sources",
   "capacity expansion models",
   "sector coupling"
  ],
  "teaser": "The intermittent nature of wind and solar power has led to a scientific consensus in the international energy research community that a mix of energy sources and carriers is necessary to achieve carbon neutrality. The"
 },
 {
  "id": "the-value-of-multiple-data-sources-in-machine-learning-927092",
  "nodeNumber": "0255",
  "docId": "38",
  "sourceFile": "4.pdf",
  "researcher": "Christian_Andresen",
  "title": "The value of multiple data sources in machine learning models for power system event prediction",
  "authors": [
   "Volker Hoffmann",
   "Jonatan Ralf Axel Klemets",
   "Bendik Nybakk Torsæter",
   "Gjert H. Rosenlund",
   "Christian A. Andresen"
  ],
  "publicationDate": "2021",
  "venue": "IEEE",
  "doi": "10.1109/ISGT49243.2021.9372345",
  "keywords": [
   "machine learning",
   "power system",
   "fault prediction",
   "predictive models",
   "multiple data sources",
   "shap"
  ],
  "teaser": "We describe a method for assessing the value of additional data sources used in the prediction of unwanted events (voltage dips, earth faults) in the power system. Using this method, machine learning models for event"
 },
 {
  "id": "thinking-responsibly-about-responsible-ai-and-the-dark-side-3fc89a",
  "nodeNumber": "0256",
  "docId": "138",
  "sourceFile": "1.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Thinking responsibly about responsible AI and ‘the dark side’ of AI",
  "authors": [
   "Patrick Mikalef",
   "Kieran Conboy",
   "Jenny Eriksson Lundström",
   "Aleš Popovič"
  ],
  "publicationDate": "2022-02-11",
  "venue": "European Journal of Information Systems",
  "doi": "10.1080/0960085X.2022.2026621",
  "keywords": [
   "responsible ai",
   "ai ethics",
   "artificial intelligence",
   "explainable ai",
   "dark side",
   "information systems"
  ],
  "teaser": "Artificial Intelligence (AI) has been argued to offer a myriad of improvements in how we work and live. The notion of AI comprises a wide-ranging set of technologies that allow individuals and organizations to integrate"
 },
 {
  "id": "this-changes-to-that-combining-causal-and-non-causal-93dd97",
  "nodeNumber": "0257",
  "docId": "8",
  "sourceFile": "09.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "THIS CHANGES TO THAT: COMBINING CAUSAL AND NON-CAUSAL EXPLANATIONS TO GENERATE DISEASE PROGRESSION IN CAPSULE ENDOSCOPY",
  "authors": [
   "Anuja Vats",
   "Ahmed Mohammed",
   "Marius Pedersen",
   "Nirmalie Wiratunga"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "explainable ai",
   "counterfactual",
   "semifactual",
   "saliency map",
   "capsule endoscopy",
   "medical imaging"
  ],
  "teaser": "Due to the unequivocal need for understanding the decision processes of deep learning networks, both modal-dependent and model-agnostic techniques have become very popular. Although both of these ideas provide"
 },
 {
  "id": "topology-of-fracture-networks-be7423",
  "nodeNumber": "0258",
  "docId": "33",
  "sourceFile": "10.pdf",
  "researcher": "Christian_Andresen",
  "title": "Topology of fracture networks",
  "authors": [
   "Christian André Andresen",
   "Alex Hansen",
   "Romain Le Goc",
   "Philippe Davy",
   "Sigmund Mongstad Hope"
  ],
  "publicationDate": "2013-08-08",
  "venue": "Frontiers in Physics",
  "doi": "10.3389/fphy.2013.00007",
  "keywords": [
   "fractures",
   "fracture networks",
   "network topology",
   "dual networks",
   "network analysis",
   "small-world"
  ],
  "teaser": "We propose a mapping from fracture systems consisting of intersecting fracture sheets in three dimensions to an abstract network consisting of nodes and links. This makes it possible to analyze fracture systems with the"
 },
 {
  "id": "toward-ai-governance-identifying-best-practices-and-fc09e4",
  "nodeNumber": "0259",
  "docId": "147",
  "sourceFile": "9.pdf",
  "researcher": "Patrick_Mikalef",
  "title": "Toward AI Governance: Identifying Best Practices and Potential Barriers and Outcomes",
  "authors": [
   "Emmanouil Papagiannidis",
   "Ida Merete Enholm",
   "Christian Dremel",
   "Patrick Mikalef",
   "John Krogstie"
  ],
  "publicationDate": "2022-04-20",
  "venue": "Information Systems Frontiers",
  "doi": "10.1007/s10796-022-10251-y",
  "keywords": [
   "ai governance",
   "ai data governance",
   "ai challenges and outcomes",
   "performance gains",
   "competitive advantage"
  ],
  "teaser": "In recent years artificial intelligence (AI) has been seen as a technology with tremendous potential for enabling companies to gain an operational and competitive advantage. However, despite the use of AI, businesses"
 },
 {
  "id": "towards-a-concept-for-digitalized-yard-logisticsoutlining-2fba5a",
  "nodeNumber": "0260",
  "docId": "96",
  "sourceFile": "Strandhagen et al. (2023) Towards a concept for digitalized yard logistics-Outlining the next-generation features.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Towards a Concept for Digitalized Yard Logistics—Outlining the Next-Generation Features",
  "authors": [
   "Jo Wessel Strandhagen",
   "Marco Semini",
   "Erlend Alfnes"
  ],
  "publicationDate": "2023",
  "venue": "IFIP Advances in Information and Communication Technology",
  "doi": "10.1007/978-3-031-43670-3_1",
  "keywords": [
   "yards",
   "engineer-to-order",
   "logistics",
   "digitalization",
   "industry 4.0"
  ],
  "teaser": "Yards are industrial sites for production and servicing of ships and offshore maritime installations, such as oil and gas platforms and modules, offshore windmills, and fish farms—all essential products in the maritime"
 },
 {
  "id": "towards-a-framework-for-evaluation-of-spatial-uncertainty-6cad7f",
  "nodeNumber": "0261",
  "docId": "0",
  "sourceFile": "01.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "Towards a framework for evaluation of spatial uncertainty for risk-based robotic decision-making",
  "authors": [
   "Klaus Ening",
   "Ahmed Mohammed",
   "Ingrid Bouwer Utne"
  ],
  "publicationDate": "2025",
  "venue": "Proceedings of the 35th European Safety and Reliability & the 33rd Society for Risk Analysis Europe Conference",
  "doi": "10.3850/978-981-94-3281-3_ESREL-SRA-E2025-P9797-cd",
  "keywords": [
   "failure prediction",
   "risk-based decision-making",
   "uncertainty",
   "robotic interaction",
   "subsea operations",
   "machine learning"
  ],
  "teaser": "Subsea Inspection, Maintenance and Repair (IMR) interactions on underwater Oil & Gas infrastructure can have severe consequences in case of failure. Currently, these interactions are mainly carried out using Remotely"
 },
 {
  "id": "towards-automated-fault-detection-and-diagnosis-in-district-5fac4a",
  "nodeNumber": "0262",
  "docId": "85",
  "sourceFile": "bs2023_1576.pdf",
  "researcher": "Johra_Kamilla",
  "title": "Towards automated fault detection and diagnosis in district heating customers: generation and analysis of a labeled dataset with ground truth",
  "authors": [
   "Daniel Leiria",
   "Kamilla Heimar Andersen",
   "Simon Pommerencke Melgaard",
   "Hicham Johra",
   "Anna Marszal-Pomianowska",
   "Marco Savino Piscitelli",
   "Alfonso Capozzoli",
   "Michal Zbigniew Pomianowski"
  ],
  "publicationDate": "2023-09-04",
  "venue": "Proceedings of the 18th IBPSA Conference",
  "doi": "10.26868/25222708.2023.1576",
  "keywords": [
   "district heating",
   "fault detection",
   "diagnosis",
   "automated framework",
   "energy efficiency",
   "smart heat meters"
  ],
  "teaser": "This study aims to develop a framework for automated fault detection and diagnosis (AFDD) in district heating (DH) substations by comprehensively understanding typical faults. AFDD is presently dependent on manual"
 },
 {
  "id": "uncertainty-aware-virtual-sensors-for-cyber-physical-systems-979e9b",
  "nodeNumber": "0263",
  "docId": "164",
  "sourceFile": "Uncertainty-aware_Virtual_Sensors_for_Cyber-Physical_Systems_camready.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Uncertainty-aware Virtual Sensors for Cyber-Physical Systems",
  "authors": [
   "Sagar Sen",
   "Erik Johannes Husom",
   "Arda Goknil",
   "Simeon Tverdal",
   "Phu Nguyen"
  ],
  "publicationDate": "2019",
  "venue": "IT Professional",
  "doi": null,
  "keywords": [
   "cyber-physical systems",
   "virtual sensors",
   "uncertainty estimation",
   "bayesian neural networks",
   "trustworthy ai",
   "industrial iot"
  ],
  "teaser": "Virtual sensors in Cyber-Physical Systems (CPS) are AI replicas of physical sensors that can mimic their behavior by processing input data from other sensors monitoring the same system. However, we cannot always trust"
 },
 {
  "id": "uncertainty-aware-well-placement-simulator-verified-dual-b39b97",
  "nodeNumber": "0264",
  "docId": "111",
  "sourceFile": "ICCS_Article.pdf",
  "researcher": "Kristian_Fossum",
  "title": "Uncertainty-Aware Well Placement: Simulator-Verified Dual-Network Reinforcement Learning Approach meets Particle Filters",
  "authors": [
   "Hibat Errahmen Djecta",
   "Sergey Alyaev",
   "Kristian Fossum",
   "Reidar B. Bratvold",
   "Ressi Bonti Muhammad",
   "Apoorv Srivastava"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "geosteering",
   "reinforcement learning",
   "particle filters",
   "uncertainty modeling",
   "reservoir optimization",
   "deep learning"
  ],
  "teaser": "Geosteering, the art of navigating wells to maximize the reservoir resources, is fraught with challenges of geological uncertainty and the relentless pace of real-time operations. In this paper, we present a novel"
 },
 {
  "id": "underwater-marker-based-pose-estimation-with-associated-6af0c3",
  "nodeNumber": "0265",
  "docId": "5",
  "sourceFile": "06.pdf",
  "researcher": "Ahmed_Mohammed",
  "title": "Underwater marker-based pose-estimation with associated uncertainty",
  "authors": [
   "Petter Risholm",
   "Peter Ørnulf Ivarsen",
   "Karl Henrik Haugholt",
   "Ahmed Mohammed"
  ],
  "publicationDate": null,
  "venue": null,
  "doi": null,
  "keywords": [
   "underwater robotics",
   "pose estimation",
   "aruco markers",
   "uncertainty quantification",
   "deep learning",
   "computer vision"
  ],
  "teaser": "We propose a system for 6-DoF estimation of Aruco markers with associated uncertainties in the challenging underwater environment. A state-of-the-art object detection framework (EfficientDet) was adapted to predict the"
 },
 {
  "id": "vehicle-routing-with-endogenous-learning-application-to-de4247",
  "nodeNumber": "0266",
  "docId": "236",
  "sourceFile": "2.pdf",
  "researcher": "Steffen_Bakker",
  "title": "Vehicle routing with endogenous learning: Application to offshore plug and abandonment campaign planning",
  "authors": [
   "Steffen J. Bakker",
   "Akang Wang",
   "Chrysanthos E. Gounaris"
  ],
  "publicationDate": "2021-01",
  "venue": "European Journal of Operational Research",
  "doi": "10.1016/j.ejor.2020.06.039",
  "keywords": [
   "routing",
   "endogenous learning",
   "plug and abandonment operations",
   "logistics",
   "or in maritime industry",
   "vehicle routing problem"
  ],
  "teaser": "When a particular service is performed many times, the duration of the service might reduce due to the effect of learning from similar tasks that have been performed before. In this article, we present an approach to"
 },
 {
  "id": "vendor-managed-inventory-in-tramp-shipping-611cb5",
  "nodeNumber": "0267",
  "docId": "118",
  "sourceFile": "Stålhane et al (2014) - Omega.pdf",
  "researcher": "Magnus_Stålhane",
  "title": "Vendor managed inventory in tramp shipping",
  "authors": [
   "Magnus Stålhane",
   "Henrik Andersson",
   "Marielle Christiansen",
   "Kjetil Fagerholt"
  ],
  "publicationDate": "2014-03-25",
  "venue": "Omega",
  "doi": "10.1016/j.omega.2014.03.004",
  "keywords": [
   "vendor managed inventory",
   "tramp shipping",
   "routing",
   "scheduling",
   "integer programming",
   "supply chain"
  ],
  "teaser": "This paper introduces a new problem to the OR community that combines traditional tramp shipping with a vendor managed inventory (VMI) service. Such a service may replace the more traditional contract of affreightment"
 },
 {
  "id": "verification-of-a-real-time-ensemble-based-method-for-5553ac",
  "nodeNumber": "0268",
  "docId": "107",
  "sourceFile": "1_s20_S1877750322002356_main.pdf",
  "researcher": "Kristian_Fossum",
  "title": "Verification of a real-time ensemble-based method for updating earth model based on GAN",
  "authors": [
   "Kristian Fossum",
   "Sergey Alyaev",
   "Jan Tveranger",
   "Ahmed H. Elsheikh"
  ],
  "publicationDate": "2022-10-18",
  "venue": "Journal of Computational Science",
  "doi": "10.1016/j.jocs.2022.101876",
  "keywords": [
   "geosteering",
   "machine learning",
   "deep neural network",
   "generative adversarial network",
   "ensemble randomized maximum likelihood",
   "uncertainty quantification"
  ],
  "teaser": "The complexity of geomodelling workflows is a limiting factor for quantifying and updating uncertainty in real-time during drilling. We propose Generative Adversarial Networks (GANs) for parametrization and generation"
 },
 {
  "id": "virtual-sensors-for-erroneous-data-repair-in-manufacturing-53bbbf",
  "nodeNumber": "0269",
  "docId": "165",
  "sourceFile": "Virtual sensors for erroneous data repair in manufacturing amachinelearning pipeline.pdf",
  "researcher": "Phu_Nguyen",
  "title": "Virtual sensors for erroneous data repair in manufacturing a machine learning pipeline",
  "authors": [
   "Sagar Sen",
   "Erik Johannes Husom",
   "Arda Goknil",
   "Dimitra Politaki",
   "Simeon Tverdal",
   "Phu Nguyen",
   "Nicolas Jourdan"
  ],
  "publicationDate": "2023-04-13",
  "venue": "Computers in Industry",
  "doi": "10.1016/j.compind.2023.103917",
  "keywords": [
   "manufacturing",
   "machine learning",
   "virtual sensors",
   "data repair",
   "industry 4.0",
   "sensor faults"
  ],
  "teaser": "Manufacturing converts raw materials into finished products using machine tools for controlled material removal or deposition. It can be observed using sensors installed within and around machine tools. These sensors"
 },
 {
  "id": "what-predicts-citation-counts-and-translational-impact-in-f6687f",
  "nodeNumber": "0270",
  "docId": "22",
  "sourceFile": "4.pdf",
  "researcher": "Antonios_Danelakis",
  "title": "What predicts citation counts and translational impact in headache research? A machine learning analysis",
  "authors": [
   "Antonios Danelakis",
   "Helge Langseth",
   "Parashkev Nachev",
   "Amy Nelson",
   "Marte-Helene Bjørk",
   "Manjit S. Matharu",
   "Erling Tronvik",
   "Arne May",
   "Anker Stubberud"
  ],
  "publicationDate": "2024-04-08",
  "venue": "Cephalalgia",
  "doi": "10.1177/03331024241251488",
  "keywords": [
   "artificial intelligence",
   "prediction",
   "translational",
   "deep learning",
   "neural networks",
   "bibliometrics"
  ],
  "teaser": "Background: We aimed to develop the first machine learning models to predict citation counts and the translational impact, defined as inclusion in guidelines or policy documents, of headache research, and assess which"
 },
 {
  "id": "which-chapters-and-topics-should-be-included-in-a-safety-f58834",
  "nodeNumber": "0271",
  "docId": "267",
  "sourceFile": "Final Paper_10 Safety casev2025-01RG.pdf",
  "researcher": "Thor Myklebust",
  "title": "Which chapters and topics should be included in a safety case?",
  "authors": [
   "Thor Myklebust",
   "Dorthea Mathilde Kristin Vatn",
   "Tor Stålhane"
  ],
  "publicationDate": "2025",
  "venue": "RAMS 2025",
  "doi": null,
  "keywords": [
   "safety case",
   "artificial intelligence",
   "safety standards",
   "compliance",
   "human aspects",
   "cross-domain"
  ],
  "teaser": "The research presented in this paper highlights the need for updating and expanding the chapters and content of safety cases to accommodate the evolving technological and regulatory landscape, particularly with the"
 },
 {
  "id": "yard-logistics-framework-and-classification-of-yard-types-388641",
  "nodeNumber": "0272",
  "docId": "97",
  "sourceFile": "Strandhagen et al. (2024) Yard logistics - Framework and classification of yard types.pdf",
  "researcher": "Jo_Strandhagen",
  "title": "Yard Logistics: Framework and Classification of Yard Types",
  "authors": [
   "Jo Wessel Strandhagen",
   "Marco Semini",
   "Erlend Alfnes"
  ],
  "publicationDate": "2024-09-08",
  "venue": "Advances in Production Management Systems. Production Management Systems for Volatile, Uncertain, Complex, and Ambiguous Environments: 43rd IFIP WG 5.7 International Conference, APMS 2024, Chemnitz, Germany, September 8-12, 2024, Proceedings, Part V",
  "doi": "10.1007/978-3-031-71637-9_11",
  "keywords": [
   "logistics",
   "engineer-to-order",
   "production management",
   "yard operations",
   "classification",
   "eto manufacturing"
  ],
  "teaser": "For shipyards and offshore construction yards delivering highly customized and complex products via an engineer-to-order (ETO) manufacturing approach, the importance of logistics performance is increasing. This is"
 }
];
