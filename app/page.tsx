import Image from 'next/image'
import Button from "@/components/ui/Buttton"
import {db} from "@/lib/db";

export default function Home() {
    db.set("hellow","world")
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Button variant={"default"} >hello</Button>
    </main>
  )
}
