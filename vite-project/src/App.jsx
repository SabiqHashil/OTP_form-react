import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Formik, useFormik } from "formik";
const validate = (values) => {
  const errors = {};

  if (Object.values(values.otp).some((data) => data === "")) {
    errors.otp = "This field is required.";
  }
  return errors;
};

function App() {
  const formik = useFormik({
    initialValues: {
      otp: Array.from({ length: 4 }).fill(""),
    },
    validate,
    onSubmit: (values) => {
      console.log(values.otp.join(""));
    },
  });

  const inputRef = useRef({});

  useEffect(() => {
    inputRef.current[0].focus();

    inputRef.current[0].addEventListener("paste", pasteText);

    return () => inputRef.current[0].removeEventListener("paste", pasteText);
  }, []);

  const pasteText = (event) => {
    const pastedText = event.clipboardData.getData("text");
    const fieldValues = {};
    Object.keys(otp).forEach((keys, index) => {
      fieldValues[keys] = pastedText[index];
    });
    setOtp(fieldValues);
    inputRef.current[5].focus();
  };

  const handleChange = (event, index) => {
    const { value } = event.target;

    if (/[a-z]/gi.test(value)) return;

    const currentOTP = [...formik.values.otp];

    currentOTP[index] = value.slice(-1);

    formik.setValues((prev) => ({
      ...prev,
      otp: currentOTP,
    }));

    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleBackSpace = (event, index) => {
    if (event.key === "Backspace") {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        key={index}
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        value={value}
        name={index}
        className="w-16 h-12 rounded-md mr-3 text-center text-x"
        onChange={(event) => handleChange(event, index)}
        onKeyUp={(event) => handleBackSpace(event, index)}
      />
    ));
  };

  return (
    <form action="">
      <h3 className="text-3xl mb-8">Please fill in the otp</h3>
      <Formik>
        <div>{renderInput()}</div>
      </Formik>
      {formik.errors.otp && <p className="mt-3 text-sm text-red-500">Please fill the fields.</p>}
      <button
        type="button"
        className="mt-4 w-32 border border-solid bg-[#ac9a9a] rounded hover:bg-[#9c2020] hover:border-[#3b3b3b]"
        onClick={formik.handleSubmit}
      >
        Submit
      </button>
    </form>
  );
}

export default App;
