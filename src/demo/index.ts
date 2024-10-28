import { generateStalwartText } from "../lib";

// biome-ignore lint/style/noNonNullAssertion: frontend
const inElem = document.querySelector<HTMLTextAreaElement>("#in")!;
// biome-ignore lint/style/noNonNullAssertion: frontend
const monoElem = document.querySelector<HTMLInputElement>("#mono")!;
// biome-ignore lint/style/noNonNullAssertion: frontend
const outElem = document.querySelector<HTMLTextAreaElement>("#out")!;

function update() {
  const mono = monoElem.checked;
  outElem.value = generateStalwartText(inElem.value, { mono });
}

inElem.addEventListener("input", update);
inElem.addEventListener("change", update);
monoElem.addEventListener("input", update);
monoElem.addEventListener("change", update);
update();
