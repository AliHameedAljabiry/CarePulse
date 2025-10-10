import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { redirect } from "next/navigation";


const Home = async () => {
  const session = await auth()
  const userId = session?.user?.id;
  if (session) redirect(`/patients/${userId}/register`);
  
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