import * as tableModule from './table.js';
import * as eventModule from './eventHandler.js';
import { toggleBox } from './toggle.js';

/**
 * executed when html content load is complete intialize the application
 */
document.addEventListener('DOMContentLoaded', function () {
    //display error if local storage is unsuppoerted
    if (typeof (Storage) === undefined) {
        toggleBox('no-local-storage', true);
        console.log('Dein Browser unterstützt kein local storage :(');
        return; //return early
    }

    //setup button event listeners
    eventModule.setupButtonEventListeners();

    //setup keydown event listener
    eventModule.setupDocumentEvenListener();

    //setup form event listener
    eventModule.setupFormSubmit();

    //setup input event listeners
    eventModule.setupInputEventListeners();

    //update table setup complete
    tableModule.updateTable();
});
