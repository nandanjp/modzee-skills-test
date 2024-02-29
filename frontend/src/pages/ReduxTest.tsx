import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  amountAdded,
  decrement,
  increment,
} from "../features/counter/counter-slice"
import { useFetchBreedsQuery } from "../features/dogs/dogs-slice"

const ReduxTest = () => {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()
  const increments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const { data } = useFetchBreedsQuery()
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <div className="flex gap-4 p-4 justify-center items-center">
        <p>
          Edit <code>src/App.tsx, count is: {count}</code> and save to reload.
        </p>
        <div className="grid grid-cols-3 grid-rows-5 gap-4 p-4 justify-center items-center">
          <Button onClick={() => dispatch(increment())}>increment count</Button>
          <Button onClick={() => dispatch(decrement())}>decrement count</Button>
          {increments.map(i => (
            <Button key={i} onClick={() => dispatch(amountAdded(i))}>
              add {i} count
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 justify-center items-center p-4">
        <p className="flex justify-center items-center">
          Number of dogs fetched <code> {data?.length ?? 0} </code> and save to
          reload.
        </p>
        {!data ? (
          <p>Fetching Data....</p>
        ) : (
          data?.map(breed => (
            <Card key={breed.id}>
              <CardHeader>
                <CardTitle>{breed.name}</CardTitle>
                <CardDescription>{breed.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <img
                  src={breed.image.url}
                  alt={breed.name}
                  className="rounded-lg w-56 h-56"
                />
              </CardContent>
              <CardFooter>
                <p>{breed.name}</p>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ReduxTest
