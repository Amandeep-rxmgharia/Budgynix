export default function Input({
  value,
  setValue,
  setError,
  error,
  labelName,
  placeholder,
  selectedLabel,
  categoryBudget,
  ref,
}) {
  return (
    <div className="py-5 relative w-full flex flex-col">
      <label className="font-semibold" htmlFor="">
        {labelName}
      </label>
      <input
        ref={ref}
        className="pt-1 leading-7 text-[#637387] outline-none border-b"
        placeholder={`Enter ${placeholder}...`}
        type="text"
        value={categoryBudget ? value : value[placeholder]}
        onInput={(e) => {
          if (labelName == "Amount") {
            const valueNum = parseInt(e.target.value);
            if (/^(?:\d+|\d*\.\d+)$/.test(valueNum) || e.target.value == "") {
              setValue(
                valueNum
                  ? { ...value, amount: valueNum }
                  : { ...value, amount: e.target.value }
              );
              setError({});
            }
          } else if (categoryBudget && selectedLabel) {
            const valueNum = parseInt(e.target.value);
            if (/^(?:\d+|\d*\.\d+)$/.test(valueNum) || e.target.value == "") {
              setValue(valueNum ? valueNum : e.target.value);
              setError("");
            }
          } else if (!selectedLabel && categoryBudget) {
            console.log("hii");
            setError("Select category first!");
          } else {
            setValue({ ...value, title: e.target.value });
            setError({});
          }
        }}
      />
      <p className="text-[12px] font-medium mb-3 absolute bottom-[-12px] text-[#2C6D51]">
        {error}
      </p>
    </div>
  );
}
