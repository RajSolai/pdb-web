import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Personal Desktop Web</title>
      </Head>

      <main className="text-white">
        <h1>Please go to :== Domain/'project-type'/'project-id'</h1>
        <p>only project made as public can we viewed and edited</p>
        <p>made by Solai Raj</p>
        <a href="https://github.com/RajSolai">View project on github</a>
      </main>
    </div>
  );
}
