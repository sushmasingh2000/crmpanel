import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from "@mui/material";

const OwnerCustom = ({ open, onClose, onSubmit, title, formik, fields = [] }) => {
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
                    }
                    else if (field.name === "crm_mobile" || field.name === "crm_alternate_mobile") {
                        // Custom rendering for mobile or alternate mobile field
                        return (
                            <div key={field.name} className="flex flex-col gap-1">
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    name={field.name}
                                    type={field.type || "text"}
                                    value={formik.values[field.name]}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        if (field.onChange) field.onChange(e);
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={!!error}
                                    helperText={error}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                                {field.mobileExists && (
                                    <div
                                        className="mt-1 p-2 text-xs text-red-700 cursor-pointer rounded"
                                        
                                    >
                                        Owner exists: {field.mobileExists.owner.name}
                                        <br/>
                                        Owner Mobile: {field.mobileExists.owner.mobile}
                                    </div>
                                )}
                            </div>
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
                >
                    {formik.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OwnerCustom;
