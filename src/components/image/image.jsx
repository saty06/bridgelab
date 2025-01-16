import Image from './image.png'
function ImageBackground() {
  return (
    <>
  <div className="flex items-center justify-center h-screen bg-gray-800" style={{ borderRadius:"120px", border:"2px white"}}>
  <div className="relative flex flex-col items-center justify-center w-80 h-80 bg-gray-200 rounded-full shadow-lg overflow-hidden">
    <img
      src={Image}
      alt="Profile Picture"
      className="w-full h-full object-contain "
    />
  </div>
</div>


    </>
  );
}
export default ImageBackground;
