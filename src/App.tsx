import { useEffect, useMemo, useState } from 'react';
import './App.css';

type Recipe = { id: number; name: string; emoji: string; minutes: number; ingredients: string[]; steps: string[]; category: string };
const recipes: Recipe[] = [
  {id:1,name:'鶏肉と大根のやさしい煮物',emoji:'🍲',minutes:30,category:'主菜',ingredients:['鶏もも肉','大根','しょうが'],steps:['大根を薄めのいちょう切りにし、鶏肉を一口大に切る。','鍋で鶏肉を軽く焼き、大根と水を加える。','しょうゆ・みりん・砂糖・しょうがを加え、火が通るまで煮る。']},
  {id:2,name:'れんこん入りふんわりつくね',emoji:'🍗',minutes:25,category:'主菜',ingredients:['ひき肉','れんこん','卵'],steps:['れんこんを細かく刻み、ひき肉・卵と混ぜる。','小判形に丸めてフライパンで両面を焼く。','しょうゆ・みりん・砂糖を絡めて仕上げる。']},
  {id:3,name:'キャベツと豚肉の蒸し焼き',emoji:'🥬',minutes:15,category:'主菜',ingredients:['キャベツ','豚肉','しょうが'],steps:['キャベツをざく切り、豚肉を食べやすい大きさに切る。','フライパンにキャベツと豚肉を重ね、水少々を入れる。','ふたをして蒸し焼きにし、ポン酢などで味付けする。']},
  {id:4,name:'大根と油揚げのみそ汁',emoji:'🥣',minutes:15,category:'汁物',ingredients:['大根','油揚げ'],steps:['大根を薄切り、油揚げを短冊切りにする。','だしで大根が柔らかくなるまで煮る。','油揚げを加え、火を弱めてみそを溶く。']},
  {id:5,name:'にんじんと卵の炒め物',emoji:'🥕',minutes:10,category:'副菜',ingredients:['にんじん','卵'],steps:['にんじんを細切りにする。','フライパンでにんじんを炒め、柔らかくする。','溶き卵を加え、塩・しょうゆ少々で味を整える。']},
  {id:6,name:'じゃがいもと玉ねぎのチーズ焼き',emoji:'🧀',minutes:20,category:'副菜',ingredients:['じゃがいも','玉ねぎ','チーズ'],steps:['じゃがいもを薄切りにして電子レンジで柔らかくする。','玉ねぎを薄切りにし、耐熱皿に並べる。','チーズをのせてトースターで焼き色がつくまで焼く。']},
  {id:7,name:'豆腐とわかめのスープ',emoji:'🍵',minutes:10,category:'汁物',ingredients:['豆腐','わかめ'],steps:['鍋に水と鶏がらスープの素を入れて温める。','豆腐とわかめを加え、軽く煮る。','しょうゆ・ごま油少々で仕上げる。']},
  {id:8,name:'トマトときゅうりのさっぱり和え',emoji:'🥗',minutes:8,category:'副菜',ingredients:['トマト','きゅうり'],steps:['トマトときゅうりを食べやすく切る。','酢・しょうゆ・砂糖・ごま油を混ぜる。','野菜と和えて完成。']},
  {id:9,name:'鶏肉と玉ねぎの照り焼き',emoji:'🍗',minutes:20,category:'主菜',ingredients:['鶏もも肉','玉ねぎ'],steps:['鶏肉を一口大、玉ねぎを薄切りにする。','フライパンで鶏肉をしっかり加熱し、玉ねぎを炒める。','しょうゆ・みりん・砂糖を絡める。']},
  {id:10,name:'ひよこ豆とトマトのサラダ',emoji:'🫘',minutes:10,category:'副菜',ingredients:['ひよこ豆','トマト'],steps:['水煮のひよこ豆を水切りする。','トマトを角切りにする。','オリーブ油・塩・レモン汁で和える。']},
  {id:11,name:'しらたきとにんじんのきんぴら',emoji:'🥢',minutes:15,category:'副菜',ingredients:['しらたき','にんじん'],steps:['しらたきを下ゆでして食べやすく切る。','にんじんを細切りにして炒める。','しらたきを加え、しょうゆ・みりんで炒め煮する。']},
  {id:12,name:'きのこと卵のふんわり炒め',emoji:'🍳',minutes:12,category:'主菜',ingredients:['きのこ','卵'],steps:['きのこをほぐして炒める。','溶き卵を加えてふんわり火を通す。','塩・こしょう・しょうゆ少々で仕上げる。']},
];
const normalize = (s: string) => s.trim().replace(/\s/g,'').replace(/鳥もも|鶏モモ|とりもも/g,'鶏もも肉').replace(/挽肉|ミンチ/g,'ひき肉').replace(/玉葱/g,'玉ねぎ').replace(/人参/g,'にんじん').replace(/レンコン/g,'れんこん').replace(/大根/g,'大根');
const STORAGE_KEY = 'kondate-favorites-v1';
export default function App() {
  const [input,setInput] = useState('');
  const [items,setItems] = useState<string[]>([]);
  const [searched,setSearched] = useState(false);
  const [category,setCategory] = useState('すべて');
  const [favorites,setFavorites] = useState<number[]>(() => {try {return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return []}});
  const [onlyFavorites,setOnlyFavorites] = useState(false);
  const [openId,setOpenId] = useState<number|null>(null);
  useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(favorites))},[favorites]);
  const add = () => {const incoming=input.split(/[,、，\n]/).map(normalize).filter(Boolean);setItems(old=>[...new Set([...old,...incoming])]);setInput('');setSearched(false)};
  const matches = useMemo(()=>recipes.map(recipe=>{const found=recipe.ingredients.filter(ing=>items.some(item=>item.includes(normalize(ing))||normalize(ing).includes(item)));return {...recipe,found,missing:recipe.ingredients.filter(ing=>!found.includes(ing))}}).filter(recipe=>(!onlyFavorites||favorites.includes(recipe.id))&&(category==='すべて'||recipe.category===category)&&(items.length===0||recipe.found.length>0)).sort((a,b)=>b.found.length/b.ingredients.length-a.found.length/a.ingredients.length||b.found.length-a.found.length),[items,category,onlyFavorites,favorites]);
  const shown = searched || onlyFavorites ? matches : [];
  return <main className="app"><header className="hero"><div className="eyebrow">MY FRIDGE · MY RECIPE</div><div className="hero-icon">🍳</div><h1>冷蔵庫から、<br/><span>今日のごはん。</span></h1><p>余っている食材を入力するだけ。<br/>作れそうな料理を見つけよう！</p></header>
  <section className="panel"><h2>🥬 冷蔵庫に何がある？</h2><p className="hint">食材を「、」や改行で区切って入力してね。</p><div className="input-row"><textarea aria-label="食材を入力" value={input} onChange={e=>setInput(e.target.value)} placeholder="例：鶏もも肉、大根、しょうが、卵" rows={2}/><button className="add" onClick={add}>追加 ＋</button></div><div className="chips">{items.map(item=><button className="chip" key={item} onClick={()=>{setItems(old=>old.filter(x=>x!==item));setSearched(false)}} title="クリックして削除">{item} ×</button>)}</div><div className="actions"><button className="primary" onClick={()=>{if(input.trim())add();setSearched(true);setOnlyFavorites(false)}}>✨ 献立を考える</button><button className="secondary" onClick={()=>{setItems([]);setInput('');setSearched(false);setOnlyFavorites(false)}}>クリア</button></div></section>
  <section className="results"><div className="result-heading"><h2>🍽️ おすすめ料理</h2><button className={'favorite-filter '+(onlyFavorites?'active':'')} onClick={()=>{setOnlyFavorites(!onlyFavorites);setSearched(true)}}>♥ お気に入り</button></div><div className="filters">{['すべて','主菜','副菜','汁物'].map(c=><button key={c} className={category===c?'selected':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>{!searched&&!onlyFavorites?<div className="empty">👩‍🍳<p>食材を追加して「献立を考える」を押してね！</p></div>:shown.length===0?<div className="empty">🥕<p>該当する料理が見つからなかったよ。<br/>別の食材やカテゴリでも試してね。</p></div>:<div className="recipe-grid">{shown.map(recipe=><article className="recipe" key={recipe.id}><div className="recipe-top"><div className="recipe-emoji">{recipe.emoji}</div><button className={'heart '+(favorites.includes(recipe.id)?'on':'')} aria-label="お気に入り切り替え" onClick={()=>setFavorites(old=>old.includes(recipe.id)?old.filter(x=>x!==recipe.id):[...old,recipe.id])}>{favorites.includes(recipe.id)?'♥':'♡'}</button></div><div className="meta"><span>{recipe.category}</span><span>⏱ {recipe.minutes}分</span></div><h3>{recipe.name}</h3><p className="match">{items.length?`使える食材 ${recipe.found.length} / ${recipe.ingredients.length}`:`材料 ${recipe.ingredients.length}種類`}</p><p className="ingredients"><b>必要な食材：</b>{recipe.ingredients.join('・')}</p>{recipe.missing.length>0&&items.length>0&&<p className="missing">追加で必要：{recipe.missing.join('・')}</p>}<button className="details" onClick={()=>setOpenId(openId===recipe.id?null:recipe.id)}>{openId===recipe.id?'作り方を閉じる ▲':'作り方を見る ▼'}</button>{openId===recipe.id&&<ol className="steps">{recipe.steps.map((step,i)=><li key={i}>{step}</li>)}</ol>}</article>)}</div>}</section><footer>※調味料・水・油などは家庭にあるものを想定しています。食材は十分に加熱し、アレルギーにも注意してください。<br/>このアプリは登録済みレシピから提案します（AIによる自動生成ではありません）。</footer></main>
}
