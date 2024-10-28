import { generateStalwartText } from "../lib";

// biome-ignore lint/style/noNonNullAssertion: frontend
const inElem = document.querySelector<HTMLTextAreaElement>("#in")!;
// biome-ignore lint/style/noNonNullAssertion: frontend
const monoElem = document.querySelector<HTMLInputElement>("#mono")!;
// biome-ignore lint/style/noNonNullAssertion: frontend
const outElem = document.querySelector<HTMLTextAreaElement>("#out")!;
// biome-ignore lint/style/noNonNullAssertion: frontend
const copyElem = document.querySelector<HTMLButtonElement>("#copy")!;
// biome-ignore lint/style/noNonNullAssertion: frontend
const copiedElem = document.querySelector<HTMLSpanElement>("#copied")!;

function update() {
  const mono = monoElem.checked;
  try {
    outElem.value = generateStalwartText(inElem.value, { mono });
    outElem.classList.remove("error");
  } catch (error) {
    outElem.value = error;
    outElem.classList.add("error");
  }
}

inElem.addEventListener("input", update);
inElem.addEventListener("change", update);
monoElem.addEventListener("input", update);
monoElem.addEventListener("change", update);
update();

copyElem.addEventListener("click", async () => {
  navigator.clipboard.writeText(outElem.value);
  copiedElem.hidden = false;
  // This is technically a race condition, but that's fine for us.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  copiedElem.hidden = true;
});
