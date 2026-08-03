import reportsApis from '../apis/reports';

const usePlatformReports = (platforms, filters, user, loggedInUser) => {
  return platforms.map((platform) => {
    const platformSlug = platform?.slug;
    const hookName = `useGetListingReportsGraphFor${platformSlug}Query`;
    const useHook = reportsApis[hookName];

    if (!useHook) return { error: 'Hook not found', platform: platformSlug };

    const hookResult = useHook(
      { user: user ? user : loggedInUser, ...filters?.[platform?.slug] },
      { skip: !filters?.[platform?.slug], refetchOnMountOrArgChange: true },
    );
    return { platform: platform?.slug, ...hookResult };
  });
};
export default usePlatformReports;
