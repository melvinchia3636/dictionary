import { Icon } from "@iconify/react";
import { useEffect, useState } from "react"
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

function Word() {
  const [data, setData] = useState();
  const params = useParams();

  useEffect(() => {
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + params.word)
      .then(e => e.json())
      .then(data => setData(data[0]));
  }, [params]);

  return (
    <div className="px-8 w-full sm:w-8/12 lg:w-6/12 py-24 sm:py-64">
      {data ?
        <>
          <div className="flex gap-3 items-baseline">
            <h1 className="text-4xl font-medium">{data.word}</h1>
            <p className="text-xl">{data.phonetics.filter(e => e.text && e.audio)[0]?.text}</p>
          </div>
          <div className="flex flex-col mt-8 gap-6">
            {data.meanings.map(meaning => <div>
              <h2 className="text-2xl italic mb-2">{meaning.partOfSpeech}</h2>
              <div className="flex flex-col gap-2 my-4">
                {meaning.synonyms.length > 0 && <div className="flex gap-2 text-lg">
                  Synonyms:
                  <div className="flex gap-1 text-lg flex-wrap">{meaning.synonyms.map((e, i) => <div><Link className={e.split(" ").length === 1 && "underline"} to={e.split(" ").length === 1 && "/" + e}>{e}</Link>{i < meaning.synonyms.length - 1 ? "," : ""}</div>)}</div>
                </div>}
                {meaning.antonyms.length > 0 && <div className="flex gap-2 text-lg">
                  Antonyms:
                  <div className="flex gap-1 text-lg flex-wrap">{meaning.antonyms.map((e, i) => <div><Link className={e.split(" ").length === 1 && "underline"} to={e.split(" ").length === 1 && "/" + e}>{e}</Link>{i < meaning.antonyms.length - 1 ? "," : ""}</div>)}</div>
                </div>}
              </div>
              <ol className="text-lg flex flex-col gap-2">
                {meaning.definitions.map((definition, index) => <li className="flex">
                  <div className="w-7 flex-shrink-0 inline-block">{index + 1}.</div>
                  <div>
                    <p>{definition.definition}</p>
                    <p className="mt-1 text-neutral-400 text-base">{definition.example}</p>
                  </div>
                </li>)}
              </ol>
            </div>)}
          </div>
        </> : <div className="w-full h-full flex items-center justify-center text-xl">
          Loading...
        </div>}
    </div>
  )
}

function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/${query}`);
    }
  }

  return <div className="w-full h-full flex flex-col gap-8 items-center justify-center flex-1">
    <form onSubmit={search} className="px-8 w-full sm:w-8/12 lg:w-4/12 flex flex-col gap-8">
      <div className="border-b-[1.6px] border-neutral-400 flex gap-3 items-center pb-2">
        <Icon icon="uil:search" className="text-neutral-400 w-7 h-7" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search English word" className="bg-transparent focus:outline-none text-xl w-full placeholder-neutral-400" />
      </div>
      <button type="submit" className="bg-neutral-600 w-full py-4 text-neutral-200 text-xl font-medium tracking-wide">Search</button>
    </form>
  </div>;
}

function App() {
  return <BrowserRouter>
    <div className="bg-neutral-100 text-neutral-600 w-full min-h-screen flex items-center flex-col">
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/:word" element={<Word />} />
      </Routes>
    </div>
  </BrowserRouter >
}

export default App
