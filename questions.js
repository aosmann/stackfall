/* EduQ v2 — shared question bank for the educational games portal (Lanefall, Stackfall, Slicefall, …).
   Extracted from Lanefall v10. v2: no repeats inside a run (a level that runs dry borrows from the topic's other
   levels; only when the whole topic is used up does next() repeat, flagged with Q.repeat and next.exhausted),
   and much bigger banks for the fixed-list topics. Every generator returns {q, c, w:[2 wrong], img?, code?, tag?}.
   Usage: EduQ.setLevel(1|2|3); const Q = topic.gen();  */
(function(){
let LEVEL=1;const LV=()=>LEVEL;
const ri_=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ======================= QUESTION BANK ======================= */
// every generator returns {q, c, w:[2 wrong], img?, code?, tag?}
function deck(items){let b=[];return()=>{if(!b.length)b=shuffle(items.slice());return b.pop()}}
function pickN(pool,n,correct,first){const out=[];if(first&&first!==correct)out.push(first);
  for(const v of shuffle(pool.slice())){if(out.length>=n)break;if(v!==correct&&!out.includes(v))out.push(v)}return out}
const fixed=list=>{const d=deck(list);return()=>{const [q,c,a,b]=d();return{q,c,w:[a,b]}}};
// pairs: [key, answer, trap?] — wrongs drawn from other answers
const paired=(pairs,fmt)=>{const d=deck(pairs),pool=pairs.map(p=>p[1]);return()=>{const [k,c,t]=d();return{q:fmt(k),c,w:pickN(pool,2,c,t)}}};
function nearNums(c,offs,allowNeg){const s=new Set([c]),out=[];let g=0;
  while(out.length<2&&g++<60){const v=c+offs[ri_(0,offs.length-1)];if(!s.has(v)&&(allowNeg||v>=0)){s.add(v);out.push(v)}}
  let k=2;while(out.length<2){const v=c+k++;if(!s.has(v)){s.add(v);out.push(v)}}return out.map(String)}
const num=(q,c,offs,neg)=>({q:q+' = ?',c:String(c),w:nearNums(c,offs,neg)});

/* ---- English ---- */
// every bank is split into three levels; LV() is the difficulty picked for the topic
const byLv=(b,mk)=>{const d=[1,2,3].map(l=>mk(b[l],l));return()=>d[LV()-1]()};
const fixedL=b=>byLv(b,list=>fixed(list));
const pairedL=(b,fmt)=>byLv(b,list=>paired(list,fmt));
const VERBS={1:[["go","went","gone","goed"],["eat","ate","eaten","eated"],["see","saw","seen","seed"],["come","came","come","comed"],["run","ran","run","runned"],
  ["sleep","slept","slept","sleeped"],["find","found","found","finded"],["feel","felt","felt","fell"],["give","gave","given","gived"],["take","took","taken","taked"],["make","made","made","maked"],["have","had","had","haved"],["say","said","said","sayed"],["sit","sat","sat","sitted"],["tell","told","told","telled"]],
 2:[["buy","bought","bought","brought"],["bring","brought","brought","bought"],["think","thought","thought","thank"],["catch","caught","caught","cought"],
  ["teach","taught","taught","tought"],["write","wrote","written","writ"],["drink","drank","drunk","drinked"],["leave","left","left","leaved"],
  ["know","knew","known","knowed"],["drive","drove","driven","drived"],["break","broke","broken","braked"],["speak","spoke","spoken","speaked"],["lose","lost","lost","losed"],["meet","met","met","meeted"],["pay","paid","paid","payed"],["sell","sold","sold","selled"],["understand","understood","understood","understanded"]],
 3:[["swim","swam","swum","swimmed"],["begin","began","begun","begon"],["choose","chose","chosen","choosed"],["fly","flew","flown","flied"],
  ["forget","forgot","forgotten","forgetted"],["ride","rode","ridden","rided"],["steal","stole","stolen","stealed"],["wear","wore","worn","weared"],
  ["seek","sought","sought","seeked"],["forbid","forbade","forbidden","forbidded"],["arise","arose","arisen","arised"],["freeze","froze","frozen","freezed"],
  ["shake","shook","shaken","shaked"],["sing","sang","sung","singed"],["hide","hid","hidden","hided"],["bite","bit","bitten","bited"],["tear","tore","torn","teared"],["slide","slid","slid","slided"],["bear","bore","borne","beared"]]};
const irregular=byLv(VERBS,(list,l)=>{const d=deck(list);return()=>{const [b,p,pp,trap]=d();const reg=b.endsWith('e')?b+'d':b+'ed';
  if(Math.random()<[.8,.55,.35][l-1])return{q:`Past simple of ${b.toUpperCase()}`,c:p,w:pickN([reg,pp,trap,b],2,p)};
  return{q:`Past participle of ${b.toUpperCase()}`,c:pp,w:pickN([reg,p,trap,b],2,pp)}}});
const tenses=fixedL({1:[
 ["She ___ to school every day","goes","is going","went"],["Look! It ___ outside","is raining","rains","rained"],["I ___ him yesterday","saw","see","have seen"],
 ["They ___ football last Sunday","played","play","playing"],["He ___ TV right now","is watching","watches","watched"],["Water ___ at 100 °C","boils","is boiling","boiled"],
 ["She usually ___ coffee","drinks","is drinking","drank"],["We ___ pizza last night","ate","eat","eating"],["Listen! The baby ___","is crying","cries","cried"],
 ["My dad ___ in a bank","works","is work","working"],["Yesterday I ___ my grandma","visited","visit","visiting"],["She ___ English very well","speaks","speak","speaking"],["We ___ to the park every Sunday","go","goes","going"],["Be quiet! I ___","am reading","read","reads"],["Last year we ___ to Spain","went","go","have gone"],
 ["My brother ___ his bike every morning","rides","is riding","rode"],["Shh! The children ___","are sleeping","sleep","slept"],["I ___ breakfast at 7 every day","have","am having","had"],
 ["Two days ago we ___ a film","watched","watch","are watching"],["Look! She ___ a red dress","is wearing","wears","wear"],["Cats ___ milk","like","likes","are liking"],
 ["He ___ his homework last night","did","does","is doing"],["The sun ___ in the east","rises","is rising","rose"],["Where ___ you yesterday?","were","are","was"],
 ["I can't talk now, I ___ lunch","am eating","eat","ate"],["She ___ to music every evening","listens","is listening","listened"],["We ___ a cake last weekend","made","make","are making"],
 ["What ___ you doing now?","are","do","did"],["My parents ___ in Cluj","live","lives","living"],["It ___ a lot in winter","snows","is snowing","snowed"],["He ___ the window an hour ago","opened","opens","is opening"]],
 2:[["We ___ here since 2020","have lived","live","lived"],["When I called, she ___ dinner","was cooking","cooks","has cooked"],["Have you ever ___ sushi?","eaten","ate","eat"],
 ["I've already ___ my homework","finished","finish","finishing"],["I ___ to Paris twice","have been","was","am"],["While I ___ home, it started to rain","was walking","walk","have walked"],
 ["I think it ___ tomorrow","will rain","rained","raining"],["She ___ her keys, so she can't get in","has lost","loses","is losing"],
 ["They ___ TV when the lights went out","were watching","watched","watch"],["How long ___ you known her?","have","did","are"],["I ___ dinner when you called","was having","have","have had"],["She ___ lived here for ten years","has","is","was"],["Next week I ___ my uncle","am visiting","visited","have visited"],["They ___ finished yet","haven't","didn't","aren't"],["___ you ever been to London?","Have","Did","Were"],
 ["I ___ my phone. Have you seen it?","have lost","lose","was losing"],["She ___ a shower when the phone rang","was having","has","has had"],["We ___ each other for years","have known","know","knew"],
 ["___ you finish the report yesterday?","Did","Have","Were"],["They ___ just left","have","are","did"],["Don't worry, you ___ the test next week","will pass","passed","have passed"],
 ["It ___ since this morning","has been raining","rains","rained"],["What ___ you doing at 8 last night?","were","did","have"],["Look at those clouds! It ___ rain","is going to","goes to","went to"],
 ["The train ___ at 6:30 tomorrow","leaves","left","has left"],["How long have you ___ English?","been learning","learning","learn"],["When ___ you move here?","did","have","were"],
 ["She ___ when I came in","was singing","sings","has sung"],["I ___ you later, OK?","will call","called","am call"],["They ___ in Paris last summer","were","have been","are"],["Somebody ___ my bike! It's gone","has stolen","steals","is stealing"]],
 3:[["By the time we arrived, the film ___","had started","has started","starts"],["By next June, I ___ here for ten years","will have worked","will work","worked"],
 ["If I ___ you, I'd apologise","were","am","will be"],["If it had rained, we ___ stayed in","would have","will have","had"],["The bridge ___ in 1890","was built","built","has built"],
 ["She ___ for hours when he finally called","had been waiting","was waited","has waited"],["I wish I ___ more time","had","have","will have"],
 ["He said he ___ tired","was","is being","will"],["Hardly ___ arrived when it rained","had he","he had","has he"],["If you heat ice, it ___","melts","would melt","melted"],["The letter ___ by the time I got home","had been delivered","has delivered","was delivering"],["If I had studied, I ___ passed","would have","will have","would"],["This time tomorrow, I ___ on a beach","will be lying","lay","am lain"],["Not only ___ late, but he also forgot","was he","he was","he is"],["The house ___ painted at the moment","is being","is been","has being"],
 ["If I had known, I ___ you","would have told","will tell","told"],["They ___ all the cake before we got there","had eaten","have eaten","eat"],["By 2030, scientists ___ a cure","will have found","found","have found"],
 ["The results ___ next week","will be announced","announce","will announce"],["I'd rather you ___ smoke here","didn't","don't","won't"],["It's time we ___ home","went","go","will go"],
 ["If only I ___ listened to you","had","have","would"],["The car ___ repaired yet","hasn't been","didn't be","isn't been"],["He ___ to have been a great player","is said","says","said"],
 ["No sooner ___ we sat down than the phone rang","had","have","did"],["I'll call you as soon as I ___","arrive","will arrive","arrived"],["She ___ working here for five years next month","will have been","will be","has been"],
 ["If he ___ harder, he would pass","worked","works","will work"],["The museum ___ when we visited","was being renovated","was renovating","renovated"],["Unless you ___, you'll miss the bus","hurry","will hurry","hurried"],
 ["Had I known, I ___ come","would have","will have","had"],["The work must ___ by Friday","be finished","finish","finished"]]});
const opposites=pairedL({1:[["HOT","cold"],["BIG","small"],["UP","down"],["HAPPY","sad"],["FAST","slow"],["FULL","empty"],["YOUNG","old"],["WIN","lose"],["PUSH","pull"],["OPEN","closed"],["DAY","night"],["WET","dry"],["HARD","soft"],["LONG","short"],["CLEAN","dirty"],["LIGHT","dark"],["FIRST","last"],
  ["GOOD","bad"],["BLACK","white"],["IN","out"],["LEFT","right"],["THICK","thin"],["NEAR","far"],["COME","go"],["LOVE","hate"],["GIVE","take"],["BEFORE","after"],
  ["TOP","bottom"],["START","finish"],["BOY","girl"],["SUMMER","winter"],["LAUGH","cry"],["FRONT","back"],["ON","off"],["YES","no"],["ABOVE","below"]],
 2:[["EARLY","late"],["HEAVY","light"],["STRONG","weak"],["RICH","poor"],["NOISY","quiet"],["CHEAP","expensive"],["ARRIVE","leave"],["REMEMBER","forget"],["ALWAYS","never"],["BUY","sell"],["ACCEPT","refuse"],["DANGEROUS","safe"],["MAJORITY","minority"],["TIGHT","loose"],["POLITE","rude"],["SHALLOW","deep"],["QUESTION","answer"],
  ["ENTRANCE","exit"],["BORROW","lend"],["SMOOTH","rough"],["BEGINNING","end"],["FRIEND","enemy"],["SHARP","blunt"],["WIDE","narrow"],["SUCCESS","failure"],["TRUE","false"],
  ["WILD","tame"],["FORWARDS","backwards"],["PRESENT","absent"],["INSIDE","outside"],["FREEZE","melt"],["SPEND","save"],["ATTACK","defend"]],
 3:[["ANCIENT","modern"],["GENEROUS","selfish"],["ARTIFICIAL","natural"],["TEMPORARY","permanent"],["SCARCE","plentiful"],["VAGUE","precise"],["BRAVE","cowardly"],["MAXIMUM","minimum"],["INCREASE","decrease"],["FREQUENT","rare"],["GUILTY","innocent"],["EXPAND","shrink"],["OPTIMIST","pessimist"],["ARRIVAL","departure"],["VOLUNTARY","compulsory"],["ASCEND","descend"],["CONCAVE","convex"],
  ["HUMBLE","arrogant"],["TRANSPARENT","opaque"],["HOSTILE","friendly"],["EXTERIOR","interior"],["CONFIRM","deny"],["MINOR","major"],["ACQUIT","convict"],["SUPERIOR","inferior"],
  ["NOVICE","expert"],["FERTILE","barren"],["LENIENT","strict"],["INFLATE","deflate"],["EXPLICIT","implicit"],["DOMESTIC","foreign"],["VERTICAL","horizontal"],["INHALE","exhale"],["ZENITH","nadir"]]},k=>`Opposite of ${k}`);
const prepositions=fixedL({1:[
 ["The book is ___ the table","on","at","of"],["See you ___ Monday","on","in","at"],["I was born ___ 2010","in","on","at"],["Let's meet ___ 5 o'clock","at","in","on"],
 ["The cat is ___ the box","in","at","to"],["I go to school ___ bus","by","with","on"],["We live ___ Romania","in","at","on"],["I listen ___ music","to","at","for"],
 ["Wait ___ me!","for","to","on"],["The ball is ___ the chair","under","at","of"],["The cat sat ___ to me","next","near","by"],["She lives ___ London","in","at","on"],["Put the milk ___ the fridge","in","on","at"],["My birthday is ___ May","in","on","at"],["We go home ___ 3 p.m.","at","in","on"],
 ["The picture is ___ the wall","on","in","at"],["I'm ___ home","at","in","on"],["She jumped ___ the pool","into","onto","at"],["Christmas is ___ December","in","on","at"],
 ["We have lunch ___ noon","at","in","on"],["The shop is ___ the bank and the café","between","under","on"],["I'm going ___ the cinema","to","at","in"],["The keys are ___ my bag","in","on","at"],
 ["Go ___ the stairs","up","on","at"],["She's ___ holiday","on","in","at"],["I get up early ___ the morning","in","on","at"],["Is this present ___ me?","for","at","of"],
 ["The plane flew ___ the clouds","above","at","of"],["He hid ___ the door","behind","at","of"],["We walked ___ the river","along","at","of"]],
 2:[["She's good ___ maths","at","in","on"],["He's afraid ___ spiders","of","from","at"],["I'm interested ___ art","in","on","at"],["It depends ___ the weather","on","of","from"],
 ["She's proud ___ her son","of","on","for"],["We arrived ___ the airport","at","to","on"],["I'm tired ___ waiting","of","from","with"],["Thank you ___ the gift","for","of","to"],
 ["He's different ___ his brother","from","of","at"],["Who does this belong ___?","to","at","for"],["I'm looking forward ___ the trip","to","for","at"],["He's famous ___ his songs","for","of","with"],["It's full ___ water","of","with","in"],["I agree ___ you","with","to","on"],["She's worried ___ the test","about","of","at"],
 ["She's angry ___ her brother","with","on","to"],["I'm bad ___ sport","at","in","on"],["It's kind ___ you","of","to","for"],["We're excited ___ the trip","about","of","at"],
 ["She's scared ___ the dark","of","from","at"],["Listen ___ your teacher","to","at","for"],["What are you laughing ___?","at","on","for"],["I dream ___ being a pilot","of","on","at"],
 ["It's typical ___ him","of","for","to"],["He's jealous ___ his sister","of","on","at"],["Pay ___ the tickets","for","to","on"],["Are you ready ___ the test?","for","to","on"],
 ["I'm used ___ the cold","to","with","at"],["Don't shout ___ me!","at","on","for"],["The film is based ___ a book","on","of","at"]],
 3:[["She's married ___ a doctor","to","with","by"],["He insisted ___ paying","on","for","to"],["She succeeded ___ passing","in","at","on"],["I'm not keen ___ horror films","on","of","for"],
 ["He was accused ___ cheating","of","for","with"],["We congratulated her ___ winning","on","for","to"],["It's similar ___ mine","to","as","with"],
 ["She's responsible ___ the team","for","of","on"],["I apologised ___ being late","for","of","to"],["He's capable ___ more","of","to","for"],["She's addicted ___ coffee","to","on","with"],["He's aware ___ the risk","of","about","for"],["They objected ___ the plan","to","against","on"],["It's a matter ___ time","of","for","in"],["He was charged ___ theft","with","of","for"],
 ["He's fond ___ music","of","with","for"],["They're opposed ___ the idea","to","against","on"],["I'm in favour ___ the plan","of","for","to"],["She was ___ the impression it was free","under","in","on"],
 ["He's ___ charge of the team","in","on","at"],["The train was ___ time for once","on","at","by"],["She broke it ___ purpose","on","by","with"],["I met her ___ chance","by","on","at"],
 ["Sorry, I'm ___ a hurry","in","on","at"],["He's ___ risk of failing","at","in","on"],["She was furious ___ him","with","on","to"],["I'm grateful ___ your help","for","of","on"],
 ["Exercise is beneficial ___ health","to","of","at"],["She prides herself ___ her work","on","in","of"],["The decision rests ___ you","with","at","for"],["He suffers ___ headaches","from","of","with"]]});
const spelling=byLv({1:[["friend","freind","frend"],["because","becuase","becouse"],["beautiful","beatiful","beautifull"],["Wednesday","Wensday","Wednsday"],
  ["tomorrow","tommorow","tomorow"],["people","peaple","poeple"],["school","shcool","scool"],["February","Febuary","Febraury"],["Saturday","Saterday","Saturdey"],["yellow","yelow","yello"],["little","litle","littel"],["animal","animle","aminal"],["happy","hapy","happey"],["thought","thougt","thougth"],
  ["family","famliy","familly"],["water","watter","wather"],["pretty","prety","pritty"],["could","coud","cuold"],["window","windoe","windo"],["October","Octuber","Ocktober"],
  ["Thursday","Thurday","Thersday"],["birthday","brithday","birthdey"],["mother","muther","mothar"],["friendly","freindly","frendly"],["teacher","teecher","techer"],["colour","colur","coulor"],
  ["easy","eazy","easey"],["answer","anser","answar"],["juice","jucie","juse"],["minute","minite","minnute"]],
 2:[["necessary","neccessary","necesary"],["separate","seperate","separete"],["different","diffrent","diferent"],["library","libary","librery"],
  ["address","adress","addres"],["believe","beleive","belive"],["receive","recieve","receeve"],["definitely","definately","definitly"],["environment","enviroment","enviornment"],["government","goverment","govermant"],["business","buisness","busness"],["calendar","calender","calandar"],["argument","arguement","argumant"],["knowledge","knowlege","knowledgde"],
  ["restaurant","restaraunt","resturant"],["foreign","foriegn","forein"],["weird","wierd","weerd"],["neighbour","nieghbour","neihbour"],["tomatoes","tomatos","tommatoes"],
  ["interrupt","interupt","intterupt"],["disappear","dissapear","disapear"],["recommend","reccomend","recomend"],["sincerely","sincerly","sinserely"],["beginning","begining","beggining"],
  ["immediately","immediatly","imediately"],["surprise","suprise","surpprise"],["tongue","tounge","tung"],["exaggerate","exagerate","exxagerate"],["privilege","priviledge","privelege"],["guarantee","garantee","guarentee"]],
 3:[["accommodate","accomodate","acommodate"],["embarrass","embarass","embarras"],["conscience","concience","consience"],["millennium","millenium","milennium"],
  ["occurrence","occurence","ocurrence"],["rhythm","rythm","rhythym"],["questionnaire","questionaire","questionnair"],["liaison","liason","liasion"],["bureaucracy","beaurocracy","bureacracy"],["entrepreneur","entrepeneur","entreprenuer"],["mischievous","mischievious","mischevous"],["pharaoh","pharoah","pharoh"],["onomatopoeia","onomatopeia","onomatopoea"],["playwright","playwrite","plawright"],
  ["conscientious","consciencious","concientious"],["acquaintance","aquaintance","acquaintence"],["unnecessary","unneccessary","unecessary"],["manoeuvre","manouvre","manoevre"],
  ["hierarchy","heirarchy","hierachy"],["miniature","miniture","minature"],["silhouette","silhoutte","silouette"],["handkerchief","hankerchief","handkercheif"],
  ["pronunciation","pronounciation","pronunciaton"],["perseverance","perseverence","perserverance"],["vacuum","vaccum","vacuume"],["fluorescent","flourescent","fluorescant"],
  ["connoisseur","connoiseur","conoisseur"],["idiosyncrasy","idiosyncracy","idiosincrasy"],["accidentally","accidently","acidentally"],["committee","commitee","comittee"]]},
 list=>{const d=deck(list);return()=>{const [c,a,b]=d();return{q:'Which is spelled right?',c,w:[a,b]}}});
const phrasal=fixedL({1:[
 ["To WAKE UP means to…","stop sleeping","eat","run"],["To SIT DOWN means to…","take a seat","stand","jump"],["To TURN ON a light means to…","switch it on","break it","paint it"],
 ["To PUT ON a coat means to…","wear it","wash it","sell it"],["To LOOK FOR means to…","search","watch","avoid"],["To GET UP means to…","leave your bed","fall asleep","go out"],
 ["To TAKE OFF shoes means to…","remove them","buy them","clean them"],["To COME BACK means to…","return","leave","arrive late"],["To TURN OFF the TV means to…","switch it off","fix it","buy it"],["To STAND UP means to…","rise to your feet","sit","lie down"],["To GO OUT means to…","leave the house","sleep","cook"],["To PICK UP a pen means to…","lift it","drop it","break it"],["To HURRY UP means to…","go faster","stop","wait"],
 ["To LIE DOWN means to…","rest flat","jump","eat"],["To COME IN means to…","enter","leave","sing"],["To GIVE BACK means to…","return it","keep it","lose it"],
 ["To THROW AWAY means to…","put in the bin","catch","keep"],["To WRITE DOWN means to…","note it","erase it","read it"],["To CALM DOWN means to…","relax","shout","run"],
 ["To CLEAN UP means to…","tidy","mess up","paint"],["To GROW UP means to…","become an adult","get smaller","plant"],["To TURN AROUND means to…","face the other way","stop","sit"],
 ["To WAIT FOR means to…","stay until it comes","leave","hurry"],["To GET ON a bus means to…","board it","leave it","drive it"],["To GET OFF a bus means to…","leave it","board it","drive it"]],
 2:[["To GIVE UP means to…","quit","begin","return"],["To LOOK AFTER means to…","take care of","search for","follow"],["To CARRY ON means to…","continue","lift","stop"],
 ["To CALL OFF means to…","cancel","phone","shout"],["To RUN OUT OF means to…","have none left","escape","jog"],["To FIND OUT means to…","discover","lose","hide"],
 ["To PUT OFF a meeting means to…","postpone","attend","cancel"],["To GET ON WITH someone means to…","be friendly","board","argue"],["To TAKE UP a hobby means to…","start it","quit it","forget it"],["When a car BREAKS DOWN, it…","stops working","speeds up","parks"],["To FILL IN a form means to…","complete it","tear it","post it"],["To SHOW UP means to…","arrive","leave","hide"],["To WORK OUT the answer means to…","solve it","forget it","exercise"],
 ["To LOOK UP a word means to…","find it in a dictionary","forget it","spell it"],["To TURN UP the music means to…","make it louder","make it quieter","stop it"],
 ["To SET UP a business means to…","start it","close it","sell it"],["To GIVE IN means to…","surrender","enter","win"],["To GET OVER an illness means to…","recover","catch it","spread it"],
 ["To TAKE AFTER a parent means to…","look like them","follow them","care for them"],["To KEEP UP WITH means to…","stay level with","slow down","overtake"],
 ["To CHECK IN at a hotel means to…","register on arrival","pay and leave","book online"],["To SORT OUT a problem means to…","solve it","cause it","ignore it"],
 ["To PUT OUT a fire means to…","stop it burning","start it","watch it"],["To HOLD ON means to…","wait","drop","run"],["To BREAK UP with someone means to…","end the relationship","meet them","argue"]],
 3:[["To LOOK INTO means to…","investigate","admire","avoid"],["To BRING UP a topic means to…","mention","lift","hide"],["To CUT DOWN ON means to…","reduce","chop","raise"],
 ["To COME ACROSS means to…","find by chance","cross over","arrive"],["To TURN DOWN an offer means to…","refuse","accept","repeat"],["To SET OFF on a trip means to…","leave","arrive","pack"],
 ["To PUT UP WITH means to…","tolerate","build","lift"],["To LOOK DOWN ON means to…","feel superior to","watch","respect"],["To MAKE UP a story means to…","invent","forgive","paint"],
 ["To GET AWAY WITH means to…","escape punishment","leave early","steal"],["To FALL OUT WITH someone means to…","argue","meet","agree"],["To BREAK INTO a house means to…","enter by force","leave","paint"],["To RULE OUT means to…","exclude","include","measure"],["To SHOW OFF means to…","boast","hide","apologise"],
 ["To TAKE IN information means to…","absorb it","reject it","print it"],["To BACK UP a claim means to…","support it","deny it","reverse it"],
 ["To PUT FORWARD an idea means to…","suggest it","postpone it","reject it"],["To STAND FOR means to…","represent","oppose","stand still"],
 ["To GO THROUGH a hard time means to…","experience it","avoid it","cause it"],["To CARRY OUT a plan means to…","perform it","cancel it","draw it"],
 ["To DO WITHOUT means to…","manage without it","need it","buy it"],["To LET DOWN a friend means to…","disappoint them","help them","lower them"],
 ["When a medicine WEARS OFF, it…","stops working","starts working","tastes bad"],["To HOLD UP traffic means to…","delay it","guide it","lift it"],
 ["To TURN OUT to be means to…","prove to be","refuse to be","leave"],["To SEE THROUGH a lie means to…","recognise it","believe it","tell it"]]});

/* ---- Math ---- */
const quickSums=()=>{const m=[10,20,50][LV()-1];return Math.random()<.5?(()=>{const a=ri_(1,m-2),b=ri_(1,m-a);return num(`${a} + ${b}`,a+b,[-2,-1,1,2,3])})()
  :(()=>{const a=ri_(4,m),b=ri_(1,a-1);return num(`${a} − ${b}`,a-b,[-2,-1,1,2,3])})()};
const twoDigits=()=>{const L=LV(),[A,B]=[[[11,39],[10,29]],[[18,69],[12,29]],[[120,480],[45,299]]][L-1];
  return Math.random()<.5?(()=>{const a=ri_(...A),b=ri_(...B);return num(`${a} + ${b}`,a+b,[-10,10,-1,1])})()
  :(()=>{const b=ri_(...B),a=b+ri_(5,A[1]);return num(`${a} − ${b}`,a-b,[-10,10,-1,1])})()};
// Easy: 2–5 × 1–10. Medium: 2–10, one factor usually 6–9 (no more 2×2 on Medium). Hard: 3–12, one factor 6–12.
const times=()=>{const L=LV();let a,b;
  if(L===1){a=ri_(2,5);b=ri_(1,10)}
  else if(L===2){a=Math.random()<.8?ri_(6,9):ri_(3,10);b=ri_(2,10)}
  else{a=ri_(6,12);b=ri_(2,12)}
  if(Math.random()<.5)[a,b]=[b,a];
  return num(`${a} × ${b}`,a*b,[-a,a,-b,b,1,-1])};
const division=()=>{const L=LV(),b=ri_(2,[5,10,12][L-1]),c=ri_(2,[12,12,15][L-1]);return num(`${b*c} ÷ ${b}`,c,[-1,1,2,-2])};
const percent=()=>{const L=LV(),P=[[10,50],[10,20,25,50],[15,25,30,75]][L-1],p=P[ri_(0,P.length-1)],n=L===1?ri_(1,30)*10:ri_(2,25)*20;return num(`${p}% of ${n}`,n*p/100,[-10,10,-5,5])};
const negatives=()=>{const m=[9,15,40][LV()-1],t=Math.random(),a=ri_(2,m),b=ri_(2,m+5);
  if(t<.4)return num(`−${a} + ${b}`,b-a,[-2*b,-1,1,2,2*a],true);
  if(t<.7)return num(`${a} − ${a+b}`,-b,[2*b,-1,1,-2],true);
  return num(`−${a} − ${b}`,-a-b,[2*b,2*a,-1,1],true)};
const squares=()=>{const L=LV(),t=Math.random();if(L===3&&t<.25){const a=ri_(2,10);return num(`${a}³`,a*a*a,[a*a,-a*a,a,-1,1])}
  if(t<.6){const a=ri_(2,[12,15,25][L-1]);return num(`${a}²`,a*a,[a,-a,2*a,-1,1])}
  const a=ri_(2,[12,15,25][L-1]);return num(`√${a*a}`,a,[-1,1,2,a])};
const order=()=>{const L=LV(),a=ri_(2,[9,9,20][L-1]),b=ri_(2,[4,6,9][L-1]),d=ri_(2,[4,6,9][L-1]);
  if(Math.random()<.5){const c=a+b*d,wrong=(a+b)*d;const o={q:`${a} + ${b} × ${d} = ?`,c:String(c),w:[]};o.w=[String(wrong===c?c+1:wrong),String(c+d)];if(o.w[1]===o.w[0])o.w[1]=String(c-1);return o}
  const c=(a+b)*d;return{q:`(${a} + ${b}) × ${d} = ?`,c:String(c),w:[String(a+b*d),String(c+d)]}};

/* ---- Geography ---- */
const EURO_CAPS={1:[["France","Paris","Marseille"],["Germany","Berlin","Munich"],["Italy","Rome","Milan"],["Spain","Madrid","Barcelona"],["United Kingdom","London","Manchester"],
  ["Romania","Bucharest","Cluj-Napoca"],["Greece","Athens","Thessaloniki"],["Portugal","Lisbon","Porto"],["Netherlands","Amsterdam","Rotterdam"],["Russia","Moscow","Saint Petersburg"],["Sweden","Stockholm","Gothenburg"],["Austria","Vienna","Salzburg"],["Poland","Warsaw","Kraków"]],
 2:[["Austria","Vienna","Salzburg"],["Hungary","Budapest"],["Poland","Warsaw","Kraków"],["Belgium","Brussels","Antwerp"],["Sweden","Stockholm"],["Norway","Oslo"],
  ["Denmark","Copenhagen"],["Ireland","Dublin","Cork"],["Czechia","Prague"],["Finland","Helsinki"],["Switzerland","Bern","Zurich"],["Ukraine","Kyiv","Odesa"]],
 3:[["Bulgaria","Sofia"],["Serbia","Belgrade"],["Croatia","Zagreb","Split"],["Moldova","Chișinău"],["Slovakia","Bratislava"],["Slovenia","Ljubljana"],["Estonia","Tallinn"],
  ["Latvia","Riga"],["Lithuania","Vilnius","Kaunas"],["Iceland","Reykjavík"],["Albania","Tirana"],["North Macedonia","Skopje"],["Montenegro","Podgorica"],["Malta","Valletta"],
  ["Bosnia and Herzegovina","Sarajevo"],["Belarus","Minsk"],["Cyprus","Nicosia"],["Liechtenstein","Vaduz"],["Andorra","Andorra la Vella"]]};
/* capitals are asked both ways: "Capital of France" and "Paris is the capital of…" */
const capsBoth=b=>{const fw=pairedL(b,k=>`Capital of ${k}`),bw=byLv(b,list=>{const caps=list.map(p=>p[1]),ctry=list.map(p=>p[0]),d=deck(list);
  return()=>{const [c,k]=d();return{q:`${k} is the capital of…`,c,w:pickN(ctry,2,c)}}});return()=>Math.random()<.5?fw():bw()};
const euroCaps=capsBoth(EURO_CAPS);
const WORLD_CAPS={1:[["Japan","Tokyo","Osaka"],["China","Beijing","Shanghai"],["United States","Washington","New York"],["Canada","Ottawa","Toronto"],["Egypt","Cairo","Alexandria"],
  ["Mexico","Mexico City","Cancún"],["Argentina","Buenos Aires"],["South Korea","Seoul","Busan"],["Thailand","Bangkok","Phuket"],["India","New Delhi","Mumbai"],["Cuba","Havana"],["Iraq","Baghdad","Basra"],["Jamaica","Kingston","Montego Bay"]],
 2:[["Australia","Canberra","Sydney"],["Brazil","Brasília","Rio de Janeiro"],["Turkey","Ankara","Istanbul"],["Kenya","Nairobi","Mombasa"],["Peru","Lima"],["Chile","Santiago"],
  ["Vietnam","Hanoi","Ho Chi Minh City"],["Saudi Arabia","Riyadh","Jeddah"],["Morocco","Rabat","Casablanca"],["New Zealand","Wellington","Auckland"],["Venezuela","Caracas"],["Afghanistan","Kabul"],["Algeria","Algiers","Oran"],["Uruguay","Montevideo"],["Nepal","Kathmandu"],["Bangladesh","Dhaka","Chittagong"],
  ["Ecuador","Quito","Guayaquil"],["Paraguay","Asunción"],["Syria","Damascus","Aleppo"],["Jordan","Amman"],["Lebanon","Beirut"],["Qatar","Doha"],["Tunisia","Tunis"],["Libya","Tripoli"],
  ["North Korea","Pyongyang"],["Cambodia","Phnom Penh"],["Zimbabwe","Harare"],["Uganda","Kampala"],["Angola","Luanda"],["Costa Rica","San José"]],
 3:[["Nigeria","Abuja","Lagos"],["Pakistan","Islamabad","Karachi"],["Kazakhstan","Astana","Almaty"],["Myanmar","Naypyidaw","Yangon"],["Tanzania","Dodoma","Dar es Salaam"],
  ["Ivory Coast","Yamoussoukro","Abidjan"],["Mongolia","Ulaanbaatar"],["Ethiopia","Addis Ababa"],["Ghana","Accra"],["Colombia","Bogotá","Medellín"],["Philippines","Manila"],
  ["Iran","Tehran"],["Malaysia","Kuala Lumpur"],["Bhutan","Thimphu"],["Laos","Vientiane"],["Uzbekistan","Tashkent","Samarkand"],["Senegal","Dakar"],["Sudan","Khartoum"],
  ["Rwanda","Kigali"],["Madagascar","Antananarivo"],["Mozambique","Maputo"],["Zambia","Lusaka"],["Namibia","Windhoek"],["Botswana","Gaborone"],["Mali","Bamako"],["Niger","Niamey"],
  ["Cameroon","Yaoundé","Douala"],["Kyrgyzstan","Bishkek"],["Tajikistan","Dushanbe"],["Azerbaijan","Baku"],["Georgia","Tbilisi"],["Armenia","Yerevan"],["Oman","Muscat"],
  ["Honduras","Tegucigalpa"],["Nicaragua","Managua"],["Fiji","Suva"],["Papua New Guinea","Port Moresby"]]};
const worldCaps=capsBoth(WORLD_CAPS);
const FLAGS=[
 ["Germany",{t:'h',c:['#000','#DD0000','#FFCE00']}],["Netherlands",{t:'h',c:['#AE1C28','#fff','#21468B']}],["Russia",{t:'h',c:['#fff','#0039A6','#D52B1E']}],
 ["Austria",{t:'h',c:['#ED2939','#fff','#ED2939']}],["Hungary",{t:'h',c:['#CE2939','#fff','#477050']}],["Bulgaria",{t:'h',c:['#fff','#00966E','#D62612']}],
 ["Estonia",{t:'h',c:['#0072CE','#000','#fff']}],["Lithuania",{t:'h',c:['#FDB913','#006A44','#C1272D']}],["Poland",{t:'h',c:['#fff','#DC143C']}],
 ["Ukraine",{t:'h',c:['#0057B7','#FFD700']}],["Indonesia",{t:'h',c:['#CE1126','#fff']}],["Colombia",{t:'h',c:['#FCD116','#FCD116','#003893','#CE1126']}],
 ["Latvia",{t:'h',c:['#9E3039','#9E3039','#fff','#9E3039','#9E3039']}],["Thailand",{t:'h',c:['#A51931','#F4F5F8','#2D2A4A','#2D2A4A','#F4F5F8','#A51931']}],
 ["France",{t:'v',c:['#002395','#fff','#ED2939']}],["Italy",{t:'v',c:['#009246','#fff','#CE2B37']}],["Romania",{t:'v',c:['#002B7F','#FCD116','#CE1126']}],
 ["Belgium",{t:'v',c:['#000','#FDDA24','#EF3340']}],["Ireland",{t:'v',c:['#169B62','#fff','#FF883E']}],["Nigeria",{t:'v',c:['#008751','#fff','#008751']}],
 ["Mali",{t:'v',c:['#14B53A','#FCD116','#CE1126']}],["Peru",{t:'v',c:['#D91023','#fff','#D91023']}],["Guinea",{t:'v',c:['#CE1126','#FCD116','#009460']}],
 ["Ivory Coast",{t:'v',c:['#F77F00','#fff','#009E60']}],["Chad",{t:'v',c:['#002664','#FECB00','#C60C30']}],
 ["Vietnam",{t:'h',c:['#DA251D'],star:{c:'#FFFF00',r:.3}}],["Somalia",{t:'h',c:['#4189DD'],star:{c:'#FFFFFF',r:.28}}],["Morocco",{t:'h',c:['#C1272D'],star:{c:'#006233',r:.28}}],
 ["Senegal",{t:'v',c:['#00853F','#FDEF42','#E31B23'],star:{c:'#00853F',r:.16}}],["Cameroon",{t:'v',c:['#007A5E','#CE1126','#FCD116'],star:{c:'#FCD116',r:.16}}],
 ["Gabon",{t:'h',c:['#009E60','#FCD116','#3A75C4']}],["Sierra Leone",{t:'h',c:['#1EB53A','#FFFFFF','#0072C6']}],["Yemen",{t:'h',c:['#CE1126','#FFFFFF','#000000']}],
 ["Armenia",{t:'h',c:['#D90012','#0033A0','#F2A800']}],["Luxembourg",{t:'h',c:['#EF3340','#FFFFFF','#00A3E0']}],["Mauritius",{t:'h',c:['#EA2839','#1A206D','#FFD500','#00A551']}],
 ["Bolivia",{t:'h',c:['#D52B1E','#F9E300','#007934']}],["Palau",{t:'o',bg:'#4AADD6',dot:'#FFDE00',cx:.45,r:.3}],
 ["Sweden",{t:'n',bg:'#006AA7',x:'#FECC00'}],["Finland",{t:'n',bg:'#fff',x:'#002F6C'}],["Denmark",{t:'n',bg:'#C8102E',x:'#fff'}],
 ["Norway",{t:'n',bg:'#BA0C2F',x:'#fff',in:'#00205B'}],["Iceland",{t:'n',bg:'#02529C',x:'#fff',in:'#DC1E35'}],
 ["Japan",{t:'o',bg:'#fff',dot:'#BC002D',cx:.5,r:.3}],["Bangladesh",{t:'o',bg:'#006A4E',dot:'#F42A41',cx:.45,r:.3}],
 ["Switzerland",{t:'ch'}],["Czechia",{t:'cz'}],["Greece",{t:'gr'}],
 ["United States",{t:'us'}],["United Kingdom",{t:'uk'}],["China",{t:'cn'}],["Turkey",{t:'tr'}],["Brazil",{t:'br'}],["Jamaica",{t:'jm'}],
 ["India",{t:'h',c:['#FF9933','#fff','#138808'],wheel:'#000080'}],["Spain",{t:'h',c:['#AA151B','#F1BF00','#F1BF00','#AA151B']}],
 ["Argentina",{t:'h',c:['#74ACDF','#fff','#74ACDF'],dot:{c:'#F6B40E',r:.12}}],["Costa Rica",{t:'h',c:['#002B7F','#fff','#CE1126','#CE1126','#fff','#002B7F']}],
 ["Laos",{t:'h',c:['#CE1126','#002868','#002868','#CE1126'],dot:{c:'#fff',r:.2}}],["Ghana",{t:'h',c:['#CE1126','#FCD116','#006B3F'],star:{c:'#000',r:.17}}],
 ["Burkina Faso",{t:'h',c:['#EF2B2D','#009E49'],star:{c:'#FCD116',r:.18}}],["Myanmar",{t:'h',c:['#FECB00','#34B233','#EA2839'],star:{c:'#fff',r:.36}}],
 ["Cuba",{t:'h',c:['#002A8F','#fff','#002A8F','#fff','#002A8F'],tri:{c:'#CF142B',w:.43},star:{c:'#fff',r:.11,cx:.145}}],
 ["Sudan",{t:'h',c:['#D21034','#fff','#000'],tri:{c:'#007229',w:.33}}],["Bahamas",{t:'h',c:['#00778B','#FFC72C','#00778B'],tri:{c:'#000',w:.42}}],
 ["Benin",{t:'side',l:'#008751',lw:.4,c:['#FCD116','#E8112D']}],["Madagascar",{t:'side',l:'#fff',lw:.33,c:['#FC3D32','#007E3A']}],
 ["United Arab Emirates",{t:'side',l:'#FF0000',lw:.25,c:['#00732F','#fff','#000']}]];
/* a five-pointed star; rot turns it (default: one point straight up) */
function star5(x,cx,cy,r,rot){x.beginPath();for(let k=0;k<10;k++){const a=(rot==null?-Math.PI/2:rot)+k*Math.PI/5,rr=k%2?r*.4:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}x.closePath();x.fill()}
function flagURL(f){
  const W=192,H=128,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  if(f.t==='h'){const n=f.c.length;f.c.forEach((col,i)=>{x.fillStyle=col;x.fillRect(0,i*H/n,W,H/n+1)})}
  else if(f.t==='v'){const n=f.c.length;f.c.forEach((col,i)=>{x.fillStyle=col;x.fillRect(i*W/n,0,W/n+1,H)})}
  else if(f.t==='n'){x.fillStyle=f.bg;x.fillRect(0,0,W,H);const cx=W*.375,t=H*(f.in?.25:.2);
    x.fillStyle=f.x;x.fillRect(cx-t/2,0,t,H);x.fillRect(0,H/2-t/2,W,t);
    if(f.in){const u=H*.125;x.fillStyle=f.in;x.fillRect(cx-u/2,0,u,H);x.fillRect(0,H/2-u/2,W,u)}}
  else if(f.t==='o'){x.fillStyle=f.bg;x.fillRect(0,0,W,H);x.fillStyle=f.dot;x.beginPath();x.arc(W*f.cx,H/2,H*f.r,0,7);x.fill()}
  else if(f.t==='ch'){const s=H,o=(W-s)/2;x.fillStyle='#DA291C';x.fillRect(o,0,s,s);x.fillStyle='#fff';
    const a=s*.19,l=s*.62;x.fillRect(o+s/2-a/2,s/2-l/2,a,l);x.fillRect(o+s/2-l/2,s/2-a/2,l,a)}
  else if(f.t==='cz'){x.fillStyle='#fff';x.fillRect(0,0,W,H/2);x.fillStyle='#D7141A';x.fillRect(0,H/2,W,H/2);
    x.fillStyle='#11457E';x.beginPath();x.moveTo(0,0);x.lineTo(W/2,H/2);x.lineTo(0,H);x.fill()}
  else if(f.t==='side'){x.fillStyle=f.l;x.fillRect(0,0,W*f.lw,H);const n=f.c.length;f.c.forEach((col,i)=>{x.fillStyle=col;x.fillRect(W*f.lw,i*H/n,W*(1-f.lw)+1,H/n+1)})}
  else if(f.t==='us'){const s=H/13;for(let i=0;i<13;i++){x.fillStyle=i%2?'#fff':'#B22234';x.fillRect(0,i*s,W,s+1)}
    const cw=W*.4,ch=s*7;x.fillStyle='#3C3B6E';x.fillRect(0,0,cw,ch);x.fillStyle='#fff';
    for(let r=0;r<9;r++)for(let c=0;c<(r%2?5:6);c++)star5(x,cw*((r%2?2:1)+c*2)/12,ch*(r+1)/10,s*.32)}
  else if(f.t==='uk'){x.fillStyle='#012169';x.fillRect(0,0,W,H);x.lineCap='butt';
    x.strokeStyle='#fff';x.lineWidth=H*.2;x.beginPath();x.moveTo(0,0);x.lineTo(W,H);x.moveTo(W,0);x.lineTo(0,H);x.stroke();
    x.strokeStyle='#C8102E';x.lineWidth=H*.067;x.beginPath();x.moveTo(0,0);x.lineTo(W,H);x.moveTo(W,0);x.lineTo(0,H);x.stroke();
    x.fillStyle='#fff';x.fillRect(W/2-H/6,0,H/3,H);x.fillRect(0,H/2-H/6,W,H/3);x.fillStyle='#C8102E';x.fillRect(W/2-H/10,0,H/5,H);x.fillRect(0,H/2-H/10,W,H/5)}
  else if(f.t==='cn'){x.fillStyle='#EE1C25';x.fillRect(0,0,W,H);x.fillStyle='#FFFF00';star5(x,W*.167,H*.25,H*.15);
    [[.333,.1],[.4,.2],[.4,.35],[.333,.45]].forEach(([a,b])=>star5(x,W*a,H*b,H*.05,Math.atan2(H*.25-H*b,W*.167-W*a)))}
  else if(f.t==='tr'){x.fillStyle='#E30A17';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.beginPath();x.arc(H*.5,H/2,H*.25,0,7);x.fill();
    x.fillStyle='#E30A17';x.beginPath();x.arc(H*.5625,H/2,H*.2,0,7);x.fill();x.fillStyle='#fff';star5(x,H*.855,H/2,H*.125,Math.PI)}
  else if(f.t==='br'){x.fillStyle='#009C3B';x.fillRect(0,0,W,H);x.fillStyle='#FFDF00';x.beginPath();x.moveTo(W*.085,H/2);x.lineTo(W/2,H*.11);x.lineTo(W*.915,H/2);x.lineTo(W/2,H*.89);x.closePath();x.fill();
    x.fillStyle='#002776';x.beginPath();x.arc(W/2,H/2,H*.22,0,7);x.fill();x.save();x.beginPath();x.arc(W/2,H/2,H*.22,0,7);x.clip();
    x.strokeStyle='#fff';x.lineWidth=H*.04;x.beginPath();x.arc(W*.42,H*1.05,H*.6,-Math.PI*.62,-Math.PI*.18);x.stroke();x.restore()}
  else if(f.t==='jm'){x.fillStyle='#009B3A';x.fillRect(0,0,W,H);x.fillStyle='#000';x.beginPath();x.moveTo(0,0);x.lineTo(W/2,H/2);x.lineTo(0,H);x.fill();
    x.beginPath();x.moveTo(W,0);x.lineTo(W/2,H/2);x.lineTo(W,H);x.fill();x.strokeStyle='#FED100';x.lineWidth=H*.14;x.beginPath();x.moveTo(0,0);x.lineTo(W,H);x.moveTo(W,0);x.lineTo(0,H);x.stroke()}
  else if(f.t==='gr'){const s=H/9;for(let i=0;i<9;i++){x.fillStyle=i%2?'#fff':'#0D5EAF';x.fillRect(0,i*s,W,s+1)}
    x.fillStyle='#0D5EAF';x.fillRect(0,0,5*s,5*s);x.fillStyle='#fff';x.fillRect(2*s,0,s,5*s);x.fillRect(0,2*s,5*s,s)}
  if(f.tri){x.fillStyle=f.tri.c;x.beginPath();x.moveTo(0,0);x.lineTo(W*f.tri.w,H/2);x.lineTo(0,H);x.closePath();x.fill()}
  if(f.dot){x.fillStyle=f.dot.c;x.beginPath();x.arc(W*(f.dot.cx||.5),H/2,H*f.dot.r,0,7);x.fill()}
  if(f.wheel){x.strokeStyle=f.wheel;x.lineWidth=2.4;x.beginPath();x.arc(W/2,H/2,H*.135,0,7);x.stroke();x.lineWidth=1;x.beginPath();
    for(let k=0;k<24;k++){const a=k*Math.PI/12;x.moveTo(W/2,H/2);x.lineTo(W/2+Math.cos(a)*H*.135,H/2+Math.sin(a)*H*.135)}x.stroke()}
  if(f.star){x.fillStyle=f.star.c;star5(x,W*(f.star.cx||.5),H/2,H*f.star.r)}
  if(f.t!=='ch'){x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;x.strokeRect(1,1,W-2,H-2)}
  return c.toDataURL();
}
const FLAG_LV={1:['Japan','France','Italy','Germany','Switzerland','Sweden','Greece','Ukraine','Romania','Poland','Vietnam',
   'United States','United Kingdom','China','Turkey','Brazil','India','Spain','Argentina','Jamaica'],
 2:['Netherlands','Russia','Austria','Hungary','Bulgaria','Ireland','Belgium','Denmark','Norway','Finland','Czechia','Nigeria','Senegal','Cameroon','Morocco','Armenia',
   'Cuba','Ghana','Costa Rica','Bahamas','United Arab Emirates'],
 3:['Estonia','Lithuania','Latvia','Colombia','Thailand','Indonesia','Mali','Peru','Guinea','Ivory Coast','Iceland','Bangladesh','Chad','Gabon','Sierra Leone','Yemen','Mauritius','Palau','Somalia','Bolivia','Luxembourg',
   'Myanmar','Burkina Faso','Laos','Sudan','Benin','Madagascar']};
const FLAG_TRAP={Senegal:'Mali',Cameroon:'Guinea',Morocco:'Vietnam',Vietnam:'Morocco',Somalia:'Vietnam',Gabon:'Sierra Leone','Sierra Leone':'Gabon',Luxembourg:'Netherlands',Bolivia:'Lithuania',Palau:'Bangladesh',Armenia:'Colombia',Romania:'Chad',Chad:'Romania',Ireland:'Ivory Coast','Ivory Coast':'Ireland',Mali:'Guinea',Guinea:'Mali',Indonesia:'Poland',Poland:'Indonesia',
 Netherlands:'Russia',Russia:'Netherlands',Italy:'Ireland',Norway:'Iceland',Iceland:'Norway',Sweden:'Finland',Lithuania:'Bolivia',Latvia:'Austria',Austria:'Latvia',Peru:'Austria',Colombia:'Ecuador',Bangladesh:'Japan',Japan:'Bangladesh',
 China:'Vietnam','Burkina Faso':'Vietnam',Ghana:'Bolivia',Myanmar:'Ghana',Laos:'Costa Rica','Costa Rica':'Thailand',Thailand:'Costa Rica',Cuba:'Bahamas',Bahamas:'Cuba',
 Benin:'Madagascar',Madagascar:'Benin','United Arab Emirates':'Sudan',Sudan:'United Arab Emirates',India:'Ireland',Spain:'Colombia',Argentina:'Somalia'};
/* flag pictures are drawn once and reused, so the same flag always has the same picture */
const FLAG_IMG={};const flagImg=n=>FLAG_IMG[n]||(FLAG_IMG[n]=flagURL(FLAGS.find(x=>x[0]===n)[1]));
const flags=byLv(FLAG_LV,(names,l)=>{const d=deck(names),pool=FLAGS.map(f=>f[0]);return()=>{const n=d();
  const t=l>1&&pool.includes(FLAG_TRAP[n])?FLAG_TRAP[n]:null;return{q:'Which country is this?',c:n,w:pickN(pool,2,n,t),img:flagImg(n),tag:'flag'}}});

/* ---- Science ---- */
const PLANETS=['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];
const planets=byLv({1:[["The largest planet","Jupiter"],["Known as the Red Planet","Mars"],["Planet with the brightest rings","Saturn"],["Third planet from the Sun","Earth"],
  ["Closest planet to the Sun","Mercury"],["The smallest planet","Mercury"],["We live on this planet","Earth"],["Second planet from the Sun","Venus"],["Fourth planet from the Sun","Mars"],["Planet famous for its rings","Saturn"],["Named after the Roman goddess of love","Venus"],
  ["The bright 'evening star' is really this planet","Venus"],["The only planet known to have life","Earth"],["The blue planet covered mostly by water","Earth"],
  ["Rovers like Perseverance explore this planet","Mars"],["Named after the king of the Roman gods","Jupiter"],["Eighth planet from the Sun","Neptune"],["Sixth planet from the Sun","Saturn"],
  ["Biggest planet with rings you can see in a small telescope","Saturn"],["Planet just after Earth, going out from the Sun","Mars"]],
 2:[["The hottest planet","Venus"],["Farthest planet from the Sun","Neptune"],["Has the Great Red Spot","Jupiter"],["Named after the Roman god of war","Mars"],
  ["Named after the Roman sea god","Neptune"],["Planet between Earth and Jupiter","Mars"],["Planet with the most moons","Saturn"],["Often called Earth's twin","Venus"],["Fifth planet from the Sun","Jupiter"],["Seventh planet from the Sun","Uranus"],
  ["Named after the Roman messenger god","Mercury"],["Named after the Greek god of the sky","Uranus"],["Named after the Roman god of farming","Saturn"],
  ["Planet with a thick, poisonous CO₂ atmosphere","Venus"],["The biggest rocky planet","Earth"],["Home of Ganymede, the largest moon","Jupiter"],
  ["Its year lasts 365 days","Earth"],["Its year lasts only 88 days","Mercury"],["Gas giant farthest from the Sun","Neptune"],["Has red dust and two tiny moons","Mars"]],
 3:[["Planet that spins on its side","Uranus"],["Its day is longer than its year","Venus"],["Light enough to float in water","Saturn"],["First found with a telescope (1781)","Uranus"],
  ["Home of Olympus Mons, the tallest volcano","Mars"],["Has the fastest winds","Neptune"],["Fastest orbit around the Sun","Mercury"],["Has a moon called Titan","Saturn"],["Has a moon called Triton","Neptune"],["Its moons are Phobos and Deimos","Mars"],["Has a moon called Europa","Jupiter"],
  ["Its moon Io is the most volcanic place known","Jupiter"],["Has moons called Miranda and Oberon","Uranus"],["Its moon Enceladus sprays water into space","Saturn"],
  ["Predicted by maths before anyone saw it (1846)","Neptune"],["Has the canyon Valles Marineris","Mars"],["Has the shortest day, about 10 hours","Jupiter"],
  ["Had a storm called the Great Dark Spot","Neptune"],["Second-largest planet","Saturn"],["The densest planet","Earth"],["Hottest surface, about 465 °C","Venus"]]},
 list=>{const d=deck(list);return()=>{const [q,c]=d();return{q,c,w:pickN(PLANETS,2,c)}}});
const ELEMENTS={1:[["H","Hydrogen"],["O","Oxygen"],["C","Carbon"],["N","Nitrogen"],["He","Helium"],["S","Sulfur"],["Ne","Neon"],["Ar","Argon"],["F","Fluorine"],["Li","Lithium"],["I","Iodine"],["B","Boron"]],
 2:[["Fe","Iron"],["Cu","Copper"],["Zn","Zinc"],["Cl","Chlorine"],["Mg","Magnesium"],["Al","Aluminium"],["Ca","Calcium"],["P","Phosphorus"],["Si","Silicon"],["Ni","Nickel"],["Mn","Manganese"],["Co","Cobalt"],["Ti","Titanium"],["Cr","Chromium"],["Br","Bromine"],["Be","Beryllium"]],
 3:[["Au","Gold"],["Ag","Silver"],["Na","Sodium"],["K","Potassium"],["Pb","Lead"],["Hg","Mercury"],["Sn","Tin"],["W","Tungsten"],["Pt","Platinum"],["U","Uranium"],["Kr","Krypton"],["Xe","Xenon"],["Rn","Radon"],["Ra","Radium"],["Sr","Strontium"],["Ba","Barium"],["Pu","Plutonium"],["Sb","Antimony"],["Bi","Bismuth"]]};
const ALL_EL=[1,2,3].flatMap(l=>ELEMENTS[l]);
const EL_TRAP={Sb:'An',Kr:'K',Co:'Cu',Mn:'Mg',Br:'B',Ti:'Tn',Cr:'C',Ba:'B',Pu:'P',Sr:'S',P:'Ph',Si:'Sl',Ni:'N',Pt:'P',U:'Ur',K:'P',Na:'S',Ag:'Si',Au:'Ag',Pb:'Li',Hg:'Me',Sn:'Ti',W:'Tu',Fe:'Ir',Cu:'Co',Mg:'Mn',Cl:'C'};
const elements=byLv(ELEMENTS,list=>{const d=deck(list);return()=>{const [s,n]=d();
  if(Math.random()<.5)return{q:`Which element is ${s}?`,c:n,w:pickN(ALL_EL.map(e=>e[1]),2,n)};
  return{q:`Chemical symbol for ${n.toUpperCase()}`,c:s,w:pickN(ALL_EL.map(e=>e[0]),2,s,EL_TRAP[s])}}});
const body=fixedL({1:[["Organ that pumps blood","heart","lungs","liver"],["Organs we breathe with","lungs","kidneys","heart"],["We smell with our…","nose","ears","tongue"],
  ["The body's control centre","brain","heart","stomach"],["We taste with our…","tongue","nose","teeth"],["Frame of bones in the body","skeleton","muscle","skin"],["We hear with our…","ears","eyes","nose"],["We see with our…","eyes","ears","hands"],["Hard white parts that chew food","teeth","nails","bones"],["Liquid pumped around the body","blood","water","air"],["Joint in the middle of the leg","knee","elbow","wrist"],
  ["We touch and feel with our…","fingers","ears","hair"],["Joint in the middle of the arm","elbow","knee","ankle"],["Joint between hand and arm","wrist","ankle","knee"],
  ["Joint between foot and leg","ankle","wrist","elbow"],["Fingers on one hand","5","4","6"],["How many lungs do we have?","2","1","4"],["The heart is a…","muscle","bone","nerve"],
  ["Top part of the leg","thigh","shin","ankle"],["Hair grows out of the…","skin","bones","blood"],["We breathe in this gas to live","oxygen","smoke","helium"]],
 2:[["The body's largest organ","skin","liver","brain"],["Bones in an adult body","206","106","306"],["Teeth in a full adult set","32","28","24"],["Gas we breathe out","CO₂","O₂","H₂"],
  ["Organs that filter blood","kidneys","lungs","stomach"],["Coloured part of the eye","iris","pupil","retina"],["The longest bone","femur","humerus","tibia"],["Where food goes after you swallow","stomach","lungs","heart"],["The backbone is also called the…","spine","skull","rib cage"],["Bones that protect the brain","skull","ribs","spine"],["Bones that protect the lungs","ribs","skull","pelvis"],["Vessels carrying blood back to the heart","veins","arteries","nerves"],
  ["Sharp front teeth for biting","incisors","molars","canines"],["Wide back teeth for chewing","molars","incisors","canines"],["Black hole in the middle of the eye","pupil","iris","lens"],
  ["Vessels carrying blood away from the heart","arteries","veins","nerves"],["Tiny vessels between arteries and veins","capillaries","nerves","tendons"],["The kneecap is also called the…","patella","pelvis","femur"],
  ["Heart and blood vessels are the ___ system","circulatory","digestive","nervous"],["Brain and nerves are the ___ system","nervous","skeletal","circulatory"],["Chambers in a human heart","4","2","3"],
  ["Organ that stores urine","bladder","kidney","stomach"],["Normal body temperature","37 °C","35 °C","40 °C"],["Bones that protect the heart","ribs","skull","spine"]],
 3:[["Tiny air sacs in the lungs","alveoli","bronchi","villi"],["Connects muscle to bone","tendon","ligament","cartilage"],["Cells that help blood clot","platelets","red cells","white cells"],
  ["Largest internal organ","liver","lungs","brain"],["Insulin is made in the…","pancreas","liver","kidneys"],["The smallest bone is in the…","ear","foot","hand"],
  ["Pigment that colours skin","melanin","keratin","insulin"],["Cells that fight infection","white cells","red cells","platelets"],["Muscle under the lungs for breathing","diaphragm","biceps","abdomen"],["The windpipe is also called the…","trachea","oesophagus","larynx"],["Red cells carry oxygen using…","haemoglobin","insulin","plasma"],["Liquid part of the blood","plasma","platelets","bile"],["Nerve cells are called…","neurons","nephrons","platelets"],
  ["Organ that stores bile","gallbladder","pancreas","spleen"],["Flap that stops food going into the windpipe","epiglottis","uvula","larynx"],["The voice box","larynx","pharynx","trachea"],
  ["Upper chambers of the heart","atria","ventricles","valves"],["Lower chambers of the heart","ventricles","atria","valves"],["Largest artery","aorta","vena cava","carotid"],
  ["Finger-like bumps lining the small intestine","villi","alveoli","cilia"],["Connects bone to bone","ligament","tendon","cartilage"],["Part of the brain for balance","cerebellum","cerebrum","brainstem"],
  ["Light-sensitive layer at the back of the eye","retina","cornea","iris"],["Bones of the fingers","phalanges","carpals","tarsals"],["The collarbone","clavicle","scapula","sternum"],
  ["Stress hormone made by the adrenal glands","adrenaline","insulin","melanin"]]});

/* ---- Informatics ---- */
const binary=()=>{const L=LV(),bits=L+3,n=ri_([1,3,8][L-1],(1<<bits)-1),b=n.toString(2).padStart(bits,'0');
  if(Math.random()<.55){const rev=parseInt(b.split('').reverse().join(''),2);const w=pickN(nearNums(n,[-1,1,2,-2,3]),2,String(n),rev!==n?String(rev):null);
    return{q:`${b}₂ in decimal`,c:String(n),w,code:'Binary'}}
  const flip=i=>b.split('').map((d,j)=>j===i?(d==='0'?'1':'0'):d).join('');const w=pickN(b.split('').map((_,i)=>flip(i)),2,b);
  return{q:`${n} in binary`,c:b,w,code:'Binary'}};
const python=()=>{const L=LV(),P='Python';
  const T={1:['len','concat','arith'],2:['floordiv','mod','pow','len'],3:['int','repeat','div','nested','bool','pow']}[L];const k=T[ri_(0,T.length-1)];
  if(k==='len'){const wd=['cat','hello','python','code','apple','robot','loop'][ri_(0,6)];return{q:`len("${wd}")`,c:String(wd.length),w:[String(wd.length-1),String(wd.length+1)],code:P}}
  if(k==='concat'){const a=['sun','ice','rain','foot'][ri_(0,3)],b=['day','cream','bow','ball'][ri_(0,3)];return{q:`"${a}" + "${b}"`,c:`"${a}${b}"`,w:[`"${a} ${b}"`,`"${b}${a}"`],code:P}}
  if(k==='arith'){const a=ri_(2,9),b=ri_(2,5),c=ri_(2,4);return{q:`${a} + ${b} * ${c}`,c:String(a+b*c),w:pickN([String((a+b)*c),String(a+b+c),String(a*b+c),String(a+b*c+1),String(a+b*c-1)],2,String(a+b*c)),code:P}}
  if(k==='floordiv'){const a=ri_(7,20),b=ri_(2,5),c=Math.floor(a/b);return{q:`${a} // ${b}`,c:String(c),w:pickN([String(+(a/b).toFixed(2)),String(c+1),String(a%b)],2,String(c)),code:P}}
  if(k==='mod'){const b=ri_(3,5),a=ri_(7,23),c=a%b;return{q:`${a} % ${b}`,c:String(c),w:pickN([String(Math.floor(a/b)),String(c+1),String(b),String(c+2)],2,String(c)),code:P}}
  if(k==='pow'){const a=ri_(2,L===3?6:4),b=ri_(2,3),c=a**b;return{q:`${a} ** ${b}`,c:String(c),w:pickN([String(a*b),String(c+a),String(a+b),String(c*2)],2,String(c)),code:P}}
  if(k==='int'){const a=ri_(2,9),b=ri_(1,9);return{q:`int("${a}") + ${b}`,c:String(a+b),w:[`${a}${b}`,'error'],code:P}}
  if(k==='repeat'){const s=['ab','ha','no'][ri_(0,2)],n=ri_(2,3);return{q:`"${s}" * ${n}`,c:`"${s.repeat(n)}"`,w:[`"${s}${n}"`,'error'],code:P}}
  if(k==='div'){const [a,b,c,f]=[[10,4,'2.5','2'],[9,2,'4.5','4'],[7,2,'3.5','3'],[12,8,'1.5','1'],[5,2,'2.5','2']][ri_(0,4)];return{q:`${a} / ${b}`,c,w:[f,String(+f+1)],code:P}}
  if(k==='nested'){const o=[['len([1, [2, 3]])','2','3','1'],['len([[1, 2], [3, 4]])','2','4','1'],['[1, 2, 3][-1]','3','1','error'],['"code"[1]','"o"','"c"','"d"']][ri_(0,3)];return{q:o[0],c:o[1],w:[o[2],o[3]],code:P}}
  const o=[['bool("")','False','True','error'],['bool(0)','False','True','0'],['bool("0")','True','False','0'],['bool([])','False','True','[]']][ri_(0,3)];return{q:o[0],c:o[1],w:[o[2],o[3]],code:P}};
const SHORTCUTS={1:[["COPY","Ctrl+C"],["PASTE","Ctrl+V"],["UNDO","Ctrl+Z"],["SAVE","Ctrl+S"],["CUT","Ctrl+X"],["SELECT ALL","Ctrl+A"],["REFRESH PAGE","F5"],["GET HELP","F1"],["PRINT","Ctrl+P"],["FIND","Ctrl+F"],["NEW TAB","Ctrl+T"],["FULL SCREEN","F11"]],
 2:[["FIND","Ctrl+F"],["PRINT","Ctrl+P"],["REDO","Ctrl+Y"],["NEW TAB","Ctrl+T"],["BOLD","Ctrl+B"],["NEW DOCUMENT","Ctrl+N"],["UNDERLINE","Ctrl+U"],["ITALIC","Ctrl+I"],["ZOOM IN","Ctrl++"],["ZOOM OUT","Ctrl+-"],["OPEN A FILE","Ctrl+O"],["GO TO THE ADDRESS BAR","Ctrl+L"],["OPEN HISTORY","Ctrl+H"],["OPEN DOWNLOADS","Ctrl+J"]],
 3:[["CLOSE TAB","Ctrl+W"],["REOPEN CLOSED TAB","Ctrl+Shift+T"],["SWITCH APPS","Alt+Tab"],["TASK MANAGER","Ctrl+Shift+Esc"],["LOCK PC","Win+L"],
  ["SHOW DESKTOP","Win+D"],["SCREENSHOT TOOL","Win+Shift+S"],["RENAME FILE","F2"],["OPEN FILE EXPLORER","Win+E"],["OPEN RUN BOX","Win+R"],["CLOSE WINDOW","Alt+F4"],
  ["OPEN SETTINGS","Win+I"],["EMOJI PANEL","Win+."],["CLIPBOARD HISTORY","Win+V"],["NEW FOLDER","Ctrl+Shift+N"],["NEXT TAB","Ctrl+Tab"],["MINIMISE ALL WINDOWS","Win+M"]]};
/* asked both ways: "Shortcut to COPY" and "Ctrl+C is the shortcut to…" */
const shortcuts=(()=>{const fw=pairedL(SHORTCUTS,k=>`Shortcut to ${k}`),bw=byLv(SHORTCUTS,list=>{const acts=list.map(p=>p[0].toLowerCase()),d=deck(list);
  return()=>{const [a,k]=d(),c=a.toLowerCase();return{q:`${k} is the shortcut to…`,c,w:pickN(acts,2,c)}}});return()=>Math.random()<.5?fw():bw()})();
const units=fixedL({1:[["Bits in 1 byte","8","4","16"],["Binary uses 0 and…","1","2","10"],["Smallest unit of data","bit","byte","nibble"],
  ["Biggest of these","gigabyte","megabyte","kilobyte"],["Bits in 2 bytes","16","8","32"],["Smallest of these","kilobyte","megabyte","gigabyte"],["Internet speed is measured in…","Mbps","MB","°C"],["A song file is usually a few…","megabytes","terabytes","bits"],["Bytes in 1 kilobyte (kB)","1000","100","10"],["Which holds more?","1 TB","1 GB","1 MB"],["Bits in 4 bytes","32","16","24"],
  ["Bits in 8 bytes","64","32","16"],["A photo is usually a few…","megabytes","bits","terabytes"],["1 GB is about 1000…","megabytes","kilobytes","terabytes"],
  ["1 TB is about 1000…","gigabytes","megabytes","kilobytes"],["A short text message is a few hundred…","bytes","gigabytes","terabytes"],["The small 'b' in Mbps means…","bits","bytes","bands"],
  ["The big 'B' in MB means…","bytes","bits","binary"],["Bytes in 2 kB","2000","200","20"],["Bits in half a byte","4","2","6"],["Which is the smallest?","1 bit","1 byte","1 kB"],
  ["Which is bigger?","1 GB","100 MB","500 kB"],["8 bits make 1…","byte","kilobyte","nibble"]],
 2:[["Bits in a nibble","4","8","2"],["Hex A in decimal","10","11","16"],["Hex F in decimal","15","16","14"],["Bytes in 1 KiB","1024","1000","512"],
  ["Biggest of these","terabyte","gigabyte","petabit"],["Hex 10 in decimal","16","10","20"],["Hex B in decimal","11","12","10"],["Bits in 3 bytes","24","12","32"],["Decimal 12 in hex","C","B","12"],
  ["Hex C in decimal","12","13","11"],["Hex D in decimal","13","14","12"],["Hex E in decimal","14","15","13"],["Decimal 15 in hex","F","E","15"],["Decimal 10 in hex","A","10","B"],
  ["Hex digits go from 0 to…","F","9","G"],["Hex 12 in decimal","18","12","20"],["MiB in 1 GiB","1024","1000","512"],["Bits in 1 kB (1000 bytes)","8000","1000","1024"],
  ["Hexadecimal is base…","16","8","2"],["Binary is base…","2","10","8"],["Our everyday numbers are base…","10","2","16"]],
 3:[["Hex FF in decimal","255","256","240"],["Largest value in 1 byte","255","256","128"],["Bits in 4 bytes","32","16","64"],["Hex 1F in decimal","31","25","15"],
  ["KiB in 1 MiB","1024","1000","512"],["Different values in 1 byte","256","255","128"],["Hex 2A in decimal","42","32","24"],["Hex 64 in decimal","100","64","96"],["Decimal 200 in hex","C8","B8","D0"],["Bits needed for 0–255","8","16","7"],
  ["Hex 80 in decimal","128","80","100"],["Hex 7F in decimal","127","128","117"],["Hex A0 in decimal","160","100","170"],["Decimal 255 in hex","FF","EF","F0"],
  ["Decimal 16 in hex","10","F","16"],["Decimal 32 in hex","20","32","1F"],["Hex 3C in decimal","60","36","54"],["Bytes in 64 bits","8","4","16"],
  ["Different values in 16 bits","65536","65535","32768"],["Largest value in 4 bits","15","16","8"],["Hex digits needed for 1 byte","2","1","4"],["kB in 1 MB","1000","100","10"]]});

/* ---- Subjects & topics ---- */
const SUBJECTS=[
 {id:'english',name:'English',g:'Aa',blurb:'Grammar, words and spelling',topics:[
  {id:'irregular',name:'Irregular verbs',bl:'went, gone, taught, written',d:1,gen:irregular},
  {id:'opposites',name:'Opposites',bl:'hot and cold, win and lose',d:1,gen:opposites},
  {id:'tenses',name:'Tenses',bl:'present, past, perfect, continuous',d:2,gen:tenses},
  {id:'prepositions',name:'Prepositions',bl:'good at, afraid of, wait for',d:2,gen:prepositions},
  {id:'spelling',name:'Spelling',bl:'the words everyone gets wrong',d:2,gen:spelling},
  {id:'phrasal',name:'Phrasal verbs',bl:'give up, look into, call off',d:3,gen:phrasal}]},
 {id:'math',name:'Math',g:'+−',blurb:'Mental arithmetic, fast',topics:[
  {id:'sums',name:'Quick sums',bl:'add and subtract up to 20',d:1,gen:quickSums},
  {id:'twodigits',name:'Two digits',bl:'47 + 28, 83 − 36',d:2,gen:twoDigits},
  {id:'times',name:'Times tables',bl:'2× up to 12×',d:2,gen:times},
  {id:'division',name:'Division',bl:'tables in reverse',d:2,gen:division},
  {id:'percent',name:'Percentages',bl:'10%, 25%, 75% of a number',d:3,gen:percent},
  {id:'negatives',name:'Negative numbers',bl:'below zero and back',d:3,gen:negatives},
  {id:'squares',name:'Squares and roots',bl:'12², √81',d:3,gen:squares},
  {id:'order',name:'Order of operations',bl:'multiply before you add',d:3,gen:order}]},
 {id:'geo',name:'Geography',g:'◎',blurb:'Countries, capitals and flags',topics:[
  {id:'eurocaps',name:'European capitals',bl:'from Lisbon to Kyiv',d:1,gen:euroCaps},
  {id:'flags',name:'Guess the flag',bl:'stripes, crosses and circles',d:2,gen:flags},
  {id:'worldcaps',name:'World capitals',bl:'trickier than you think',d:3,gen:worldCaps}]},
 {id:'science',name:'Science',g:'H₂O',blurb:'Space, chemistry and the body',topics:[
  {id:'planets',name:'Planets',bl:'our solar system',d:1,gen:planets},
  {id:'body',name:'Human body',bl:'organs, bones and blood',d:2,gen:body},
  {id:'elements',name:'Chemical symbols',bl:'Fe, Au, Na and friends',d:3,gen:elements}]},
 {id:'info',name:'Informatics',g:'01',blurb:'Binary, code and computers',topics:[
  {id:'shortcuts',name:'Keyboard shortcuts',bl:'Ctrl + the right key',d:1,gen:shortcuts},
  {id:'units',name:'Data units',bl:'bits, bytes and hex',d:1,gen:units},
  {id:'binary',name:'Binary numbers',bl:'4-bit, both directions',d:2,gen:binary},
  {id:'python',name:'Python operators',bl:'//, %, **, len()',d:3,gen:python}]},
];
const ALL=SUBJECTS.flatMap(s=>s.topics);
SUBJECTS.push({id:'mix',name:'Mix it up',g:'✳',blurb:'Questions from every subject',topics:[
  {id:'mix-easy',name:'Easy mix',bl:'every easy topic',d:1,gen:()=>{const p=ALL.filter(t=>t.d===1);return p[ri_(0,p.length-1)].gen()}},
  {id:'mix-all',name:'Surprise me',bl:'any topic, any subject',d:2,gen:()=>ALL[ri_(0,ALL.length-1)].gen()},
  {id:'mix-hard',name:'Hard mix',bl:'only the toughest topics',d:3,gen:()=>{const p=ALL.filter(t=>t.d===3);return p[ri_(0,p.length-1)].gen()}}]});

const SICON={
 english:'<path d="M3.5 5.8c3-1.6 6-1.6 8.5.6 2.5-2.2 5.5-2.2 8.5-.6v12.6c-3-1.6-6-1.6-8.5.6-2.5-2.2-5.5-2.2-8.5-.6z"/><path d="M12 6.4V19"/>',
 math:'<path d="M7 3.8v6.4M3.8 7h6.4M13.8 7h6.4M4.6 14.6l4.8 4.8M9.4 14.6l-4.8 4.8M13.8 15.4h6.4M13.8 18.6h6.4"/>',
 geo:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5c-2.6-2.4-3.8-5.2-3.8-8.5S9.4 5.9 12 3.5z"/>',
 science:'<path d="M9.2 3.5h5.6M10.4 3.5v5.4L4.9 18.3a1.5 1.5 0 0 0 1.3 2.2h11.6a1.5 1.5 0 0 0 1.3-2.2l-5.5-9.4V3.5"/><path d="M7.6 14h8.8"/>',
 info:'<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.6 4.5l-3.2 15"/>',
 mix:'<path d="M3.5 7h3c4.8 0 6.2 10 11 10h3M17.6 14.4l3 2.6-3 2.6M3.5 17h3c1.6 0 2.8-1.1 3.8-2.7M13.7 9.7c1-1.6 2.2-2.7 3.8-2.7h3M17.6 4.4l3 2.6-3 2.6"/>'};
const SHUE={english:'#ff7a5c',math:'#f2c46d',geo:'#5fd39a',science:'#6cb8ff',info:'#b48cff',mix:'#ff7ac6'};
const DIFFNAME=['','Easy','Medium','Hard'];
const findTopic=(sid,tid)=>{const s=SUBJECTS.find(x=>x.id===sid)||SUBJECTS[0];return{subject:s,topic:s.topics.find(t=>t.id===tid)||s.topics[0]}};
/* Build a stream of questions with no repeats inside a sliding window; answers shuffled, wrongs made unique */
/* a question's identity: same answer + same operands in any order ("3 × 4" = "4 × 3", "2 + 6" = "6 + 2") */
function qKey(Q){const q=String(Q.q).replace(/\s*=\s*\?\s*$/,'').trim();
  const m=q.match(/^(-?\d+)\s*([×+])\s*(-?\d+)$/);
  const body=m?[m[1],m[3]].sort().join(m[2]):q;return body+'|'+Q.c+'|'+(Q.img||'')}
/* No repeats for the whole run. When the chosen level runs dry, the topic's other levels are used
   (nearest first, harder before easier). Only when every level is used up does a repeat come back
   (never one of the last 12); it is flagged Q.repeat and next.exhausted turns true, so a game can end the run instead. */
function stream(topic,level){const used=new Set(),recent=[],dry=new Set();
  const order=[level,...[1,2,3].filter(l=>l!==level).sort((a,b)=>Math.abs(a-level)-Math.abs(b-level)||b-a)];
  function next(){let Q,k,repeat=false,found=false;
    for(const l of order){if(dry.has(l))continue;LEVEL=l;
      for(let g=0;g<150;g++){Q=topic.gen();k=qKey(Q);if(!used.has(k)){found=true;break}}
      if(found)break;dry.add(l)}
    LEVEL=level;
    if(!found){repeat=true;next.exhausted=true;for(let g=0;g<60;g++){Q=topic.gen();k=qKey(Q);if(!recent.includes(k))break}}
    used.add(k);recent.push(k);if(recent.length>12)recent.shift();
  const c=String(Q.c),seen=new Set([c]);const raw=Q.w.slice(0,2);while(raw.length<2)raw.push(c);
  const w=raw.map(v=>{let x=String(v);while(seen.has(x))x=isNaN(+x)?x+'s':String(+x+1);seen.add(x);return x});
  const ans=shuffle([c,...w]);return{q:Q.q,img:Q.img||null,code:Q.code||null,ans,correct:ans.indexOf(c),answer:c,repeat}}
  next.exhausted=false;return next}
window.EduQ={SUBJECTS,SICON,SHUE,DIFFNAME,findTopic,stream,setLevel:l=>{LEVEL=l},shuffle,ri:ri_};
})();
