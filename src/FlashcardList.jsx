import React from "react";
import FlashCard from "./Flashcard";

export default function FlashcardList(props) {
   return (
      <div className="card-grid">
         {props.flashcards.map(flashcard => {
            return <FlashCard flashcard={flashcard} key={flashcard.id} />;
         })}
      </div>
   );
}
