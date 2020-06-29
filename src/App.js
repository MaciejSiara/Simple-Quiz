import React, { useState, useEffect, useRef } from "react";
import FlashcardList from "./FlashcardList";
import "./App.scss";
import axios from "axios";

function App() {
   const [flashcards, setFlashcards] = useState([]);
   const [categories, setCategories] = useState([]);
   const categoryEl = useRef();
   const amountEl = useRef();

   useEffect(() => {
      axios.get("https://opentdb.com/api_category.php").then(res => {
         setCategories(res.data.trivia_categories);
      });
   }, []);

   return (
      <>
         <form className="header" onSubmit={handleSubmit}>
            <div className="form-group">
               <label htmlFor="category">Category</label>
               <select id="category" ref={categoryEl}>
                  {categories.map(cat => {
                     return (
                        <option value={cat.id} key={cat.id}>
                           {cat.name}
                        </option>
                     );
                  })}
               </select>
            </div>
            <div className="form-group">
               <label htmlFor="amount">Number of Questions</label>
               <input
                  type="number"
                  id="amount"
                  min="1"
                  step="1"
                  defaultValue={10}
                  ref={amountEl}
               />
            </div>
            <div className="form-group">
               <button className="btn">Generate</button>
            </div>
         </form>
         <div className="container">
            <FlashcardList flashcards={flashcards} />
         </div>
      </>
   );

   function handleSubmit(e) {
      e.preventDefault();
      axios
         .get("https://opentdb.com/api.php", {
            params: {
               amount: amountEl.current.value,
               category: categoryEl.current.value,
            },
         })
         .then(res => {
            setFlashcards(
               res.data.results.map((resQuestion, index) => {
                  const answer = decodeString(resQuestion.correct_answer);
                  const options = [
                     ...resQuestion.incorrect_answers.map(a => decodeString(a)),
                     answer,
                  ];
                  return {
                     id: `${index}-${Date.now()}`,
                     question: decodeString(resQuestion.question),
                     answer: answer,
                     options: options.sort(() => Math.random() - 0.5),
                  };
               })
            );
         });
   }
}

function decodeString(str) {
   const text = document.createElement("textarea");
   text.innerHTML = str;
   return text.value;
}

export default App;
