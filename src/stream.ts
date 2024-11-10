// Receiving a file
const fileResponse = await fetch("https://deno.land/logo.svg");

if (fileResponse.body) {
  const file = await Deno.open("./logo.svg", { write: true, create: true });

  await fileResponse.body.pipeTo(file.writable);
}

// Sending a file
const file = await Deno.open("./logo.svg", { read: true });

await fetch("https://example.com/", {
  method: "POST",
  body: file.readable,
});