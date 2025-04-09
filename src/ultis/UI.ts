export const getStatusColor = (status: string): string => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      case "Partial Success":
        return "orange";
      default:
        return "gray";
    }
  };
  