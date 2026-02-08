export const loginApi = async (ntid: string, password: string) => {
  console.log('Login attempt:', ntid, password);

  // mock delay
  await new Promise(res => setTimeout(res, 800));

  return {
    success: true,        // ALWAYS true for now
    user: {
      ntid,
    },
  };
};
