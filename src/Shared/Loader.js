import { CircularProgress, Dialog, Slide } from '@mui/material';
import React from 'react';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Loader = ({isLoading}) => {
  return (
   <Dialog
        open={isLoading}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            backgroundImage:
                  "linear-gradient(225deg, #e98d2c 0%, rgba(20, 20, 20, 1) 61%)",
            boxShadow: "none",
          },
          className: `!h-[4rem] !w-[4rem] !flex !justify-center !items-center `,
        }}
      >
        <CircularProgress className="!text-white !z-50" />
      </Dialog>
  )
}

export default Loader
