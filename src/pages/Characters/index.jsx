import { get } from "lodash";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import axios from "../../services/axios";
import {
  CharactersContainer,
  CharacterCard,
  ButtonsWrap,
  SearchBar,
} from "./styled";

let page = 0;
let totalPage = 1;

axios.get("/personagem?limite=9").then((resp) => {
  totalPage = resp.data.info.totalPages;
});

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nameSearched, setNameSearched] = useState("");
  toast.configure();

  const getData = async (pageNumber) => {
    setIsLoading(false);
    const response = await axios.get(`/personagem?page=${pageNumber}&limite=9`);
    setCharacters(response.data.characters);
    setIsLoading(true);
  };

  const nextPage = () => {
    page += 1;
    getData(page);
  };

  const prevPage = () => {
    page -= 1;
    getData(page);
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you really want to delete this character ?")) {
      try {
        await axios.delete(`/personagem/${id}`);
        toast.success("Deleted");

        axios.get("/personagem?limite=9").then((resp) => {
          totalPage = resp.data.info.totalPages;
        });

        getData(page);
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    } else {
      // eslint-disable-next-line no-useless-return
      return;
    }
  };

  const searchData = async (e) => {
    if (nameSearched === "") {
      getData(1);
      return;
    }
    e.preventDefault();
    setIsLoading(false);
    const response = await axios.get(`/personagem?name=${nameSearched}`);
    setCharacters(response.data.characters);
    setIsLoading(true);
  };

  useEffect(() => {
    page = 1;

    axios.get("/personagem?limite=9").then((resp) => {
      totalPage = resp.data.info.totalPages;
    });

    getData(1);
  }, []);

  if (!isLoading) {
    const styleH1 = {
      textAlign: "center",
      marginTop: "40px",
    };
    return <h1 style={styleH1}>Carregando...</h1>;
  }

  return (
    <>
      <SearchBar>
        <form onSubmit={searchData}>
          <label htmlFor="nomePersonagem">
            <input
              placeholder="Pesquisar personagem"
              type="text"
              name="nomePersonagem"
              id="nomePersonagem"
              onChange={(e) => setNameSearched(e.target.value)}
              value={nameSearched}
            />
            <button type="submit">
              <BsSearch size={30} />
            </button>
          </label>
        </form>
      </SearchBar>
      <CharactersContainer>
        {characters.map((character, index) => (
          <CharacterCard key={String(character.name)}>
            <figure>
              <img
                src={get(character, "image", false)}
                alt={get(character, "image", false)}
              />
              <figcaption>
                <Link to={`/personagem/${character.id}`}>
                  <h3>
                    {get(character, "name", false)
                      ? get(character, "name")
                      : "Unknown"}
                  </h3>
                </Link>
                <p>
                  <span>Age:</span>
                  {get(character, "age", false)
                    ? get(character, "age")
                    : "Unknown"}
                </p>
                <p>
                  <span>Condition:</span>
                  {get(character, "condition", false)
                    ? get(character, "condition")
                    : "Unknown"}
                </p>
                <p>
                  <span>Occupation:</span>
                  {get(character, "occupation", false)
                    ? get(character, "occupation")
                    : "Unknown"}
                </p>
                <p>
                  <span>Genre:</span>
                  {get(character, "genre", false)
                    ? get(character, "genre")
                    : "Unknown"}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(character.id, index)}
                >
                  <AiFillDelete size={30} />
                </button>
                <Link to={`/edit/${character.id}`}>
                  <AiFillEdit size={30} />
                </Link>
              </figcaption>
            </figure>
          </CharacterCard>
        ))}
      </CharactersContainer>
      <ButtonsWrap nameSearched={nameSearched}>
        <button type="button" disabled={page === 1} onClick={() => prevPage()}>
          <FaArrowAltCircleLeft size={40} />
        </button>
        <button
          type="button"
          disabled={page === totalPage || totalPage < page}
          onClick={() => nextPage()}
        >
          <FaArrowAltCircleRight size={40} />
        </button>
      </ButtonsWrap>
    </>
  );
}
