function ModalEditFormFund() {
  return (
    <div>
       <label
        htmlFor="my-modal-donate"
        className="btn bg-red-700 w-full text-white font-semibold p-2 rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
      >
        Donate
      </label>

      <input
        type="checkbox"
        id="my-modal-donate"
        className="modal-toggle"
      />
      <label htmlFor="my-modal-donate" className="modal cursor-pointer">
        <label
          className="modal-box relative bg-white text-black max-w-xs"
          htmlFor=""
        >
          <h1 className="font-bold text-2xl mb-2 text-gray-800">Nominal</h1>
          <form >
            <input
              name="total"
              style={{ backgroundColor: "#D2D2D240" }}
              type="number"
              placeholder="Nominal Donation"
              className="text-gray-600 input input-bordered w-full max-w-xs mb-3"
            />

            <button
              type="submit"
              className="mt-7 btn bg-red-700 w-full text-white font-semibold p-2 rounded-md text-center border-none hover:bg-red-900 hover:text-white mr-4"
            >
              Donate
            </button>
          </form>
        </label>
      </label>
    </div>
  )
}

export default ModalEditFormFund