
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from "@mui/material";

const CustomDialog = ({ open, onClose, onSubmit, title, formik, fields = [] }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingTop: "16px"
        }}
      >
        {fields.map((field) => {
          const error = formik.touched[field.name] && formik.errors[field.name];

          if (field.type === "select") {
            return (
              <TextField
                key={field.name}
                select
                fullWidth
                label={field.label}
                name={field.name}
                value={formik.values[field.name]}
                onChange={field.onChange || formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!error}
                helperText={error}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          } else {
            return (
              <TextField
                key={field.name}
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!error}
                helperText={error}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  style: { padding: "12px" },
                  inputMode: field.inputProps?.inputMode || "text",
                  onPaste: (e) => {
                    if (field.onPaste) field.onPaste(e, formik.setFieldValue);
                  }
                }}
                InputProps={{
                  endAdornment: field.InputProps?.endAdornment
                }}
              />
            );
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={formik.isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          // disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default CustomDialog;
