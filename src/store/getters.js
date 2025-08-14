const getters = {
  isValidToken: (state) => state['authentication'].isValidToken,
  activityTypeTabIndex: (state) => state['setting-activity-type'].tabIndex,
  msgShow: (state) => state['alert-msg'].is_show,
  msgMessage: (state) => state['alert-msg'].message,
  msgColor: (state) => state['alert-msg'].color
};
export default getters;
