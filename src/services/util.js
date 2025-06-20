// export function transformMenuUrl(items) {
//   try {
//     // Define a mapping for menu items
//     const menuMapping = {
//       applicant: { url_name: 'applicant', icon: 'user-tie', priority: 1 },
//       category: { url_name: 'category', icon: 'table-list', priority: 4 },
//       department: { url_name: 'department', icon: 'building', priority: 5 },
//       'job description': {
//         url_name: 'job description',
//         name: 'job title',
//         icon: 'circle-info',
//         priority: 3
//       },
//       'job information': {
//         url_name: 'job information',
//         name: 'job posting',
//         icon: 'info',
//         priority: 2
//       },
//       benefit: { url_name: 'benefit', icon: 'hand-holding-heart', priority: 6 },
//       faq: { url_name: 'faq', icon: 'circle-question', priority: 7 },
//       'user management': {
//         url_name: 'User Management',
//         icon: 'users',
//         priority: 8
//       },
//       branch: { url_name: 'Branch', icon: 'location', priority: 9 }
//     };

//     // Transform items using the mapping
//     for (const item of items) {
//       const item_name = item.name.toLowerCase();
//       if (menuMapping[item_name]) {
//         Object.assign(item, menuMapping[item_name]); // Merge mapped properties into item
//       }
//     }

//     // Sort items by priority in ascending order
//     items.sort((a, b) => a.priority - b.priority);

//     return items;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }
