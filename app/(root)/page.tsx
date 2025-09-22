import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";


const Home = async () => {
  const session = await auth()
  const userId = session?.user?.id;
  console.log("session",session)
  const allusers = await db.select().from(users).limit(10);
  console.log(allusers)
  return (
    <div className="h-screen flex max-h-screen  ">
      <section className="remove-scrollbar container my-auto ">
        <div className="sub-container max-w-2xl">
             
        </div>
      </section> 
    </div>
  );
}

export default Home;