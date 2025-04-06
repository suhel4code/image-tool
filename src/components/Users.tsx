import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface UsersProps {
  values: string[];
  selectedUser: string;
  setSelectedUser: (val: string) => void;
}

export default function Users(props: UsersProps) {
  const { selectedUser, setSelectedUser, values } = props;

  return (
    <Box sx={{ marginTop: "10px" }}>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel>User</InputLabel>
        <Select
          value={selectedUser}
          label="User"
          onChange={(e) => setSelectedUser(e.target.value)}
          sx={{ width: 200 }}
        >
          {values.map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
