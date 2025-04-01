
import Head from "next/head";
import BJJGymTracker from "../components/BJJGymTracker";

export default function Home() {
  return (
    <div>
      <Head>
        <title>BJJ Gym Tracker</title>
      </Head>
      <main>
        <BJJGymTracker />
      </main>
    </div>
  );
}
