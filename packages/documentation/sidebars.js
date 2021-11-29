module.exports = {
 
  docs: [
    {
      type: 'category',
      label: 'SPAship',
      items: ["introduction", "contribution", "comparsion"],
    },
    
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        
        {
        
          type: 'category',
          label: 'Installation of SPAship',
          items: [
            {
              Kubernates: ['getting-started/installation/kubernates/kubernates'],
              "Bare Metal" : ['getting-started/installation/bare-metal/spaship-manager',
              'getting-started/installation/bare-metal/installation','getting-started/installation/bare-metal/configuration'
              
             ],
            }
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guide',
      items: [
        {
          type: 'category',
          label: 'User Guide',
          items: [
            'guide/user-guide/Quickstart',
            
          ],
        },
        {
          type: 'category',
          label: 'Dev Guide',
          items: [
            
            'guide/dev-guide/big-picture','guide/dev-guide/manager-workflow'
            
            ],
        },
      ],
    },
    {
      type: 'category',
      label: 'QA Testing',
      items: [
        'QATesting/test-process'
      ]

    }
  
  ],
};
