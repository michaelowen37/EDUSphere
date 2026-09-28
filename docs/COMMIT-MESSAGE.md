Dragging fixed on desktop for student cards and games

- Pass EF: every drag start goes through grabPointer, which prevents the browser's own selection and picture drag and survives a browser that refuses pointer capture, as Safari can; game boards turn off selection in every browser and stop native dragstart. A new browser test drags with a mouse, including with capture refused. The printed report leaves out Notes when there are none. My Completed Skills and its hide choice are centered. The Classroom page's quick checks text uses Mikey's wording on two lines.
- Pass EG: student cards on My Classroom drag with a desktop mouse. While a card is held the window follows the pointer, the card rides under it, the green line shows the landing spot among the other cards and the drop lands exactly there, selection and the browser's own drag are stopped, and the page scrolls when a card is held near the screen's edge. Three new browser checks, all of which failed on the old code.

Passes: EF, EG
