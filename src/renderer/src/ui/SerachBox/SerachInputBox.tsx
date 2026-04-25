import { SearchBar } from '@renderer/effects/AuraBar'

export function SerachInputBox() {
  return (
    <div className=" relative h-[50px] w-[250px] rounded-[15px] overflow-hidden">
      <div className=" absolute top-0 left-0 w-full h-full">
        <SearchBar></SearchBar>
      </div>
      <input
        defaultValue={'123vac'}
        className=" absolute top-0 left-0 w-full h-full text-[20px] text-white flex items-center justify-center text-center text-shadow-2xs"
      ></input>
    </div>
  )
}
