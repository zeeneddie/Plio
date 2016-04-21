import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.mixin({
  standards: {
    testData() {
      return [
        {
          _id: 1,
          title: 'Client feedback',
          number: '1',
          sub: [
            {
              _id: 2,
              title: 'Inquiry handling',
              number: '1.1'
            }
          ]
        },
        {
          _id: 3,
          title: 'Client onboarding',
          number: '2',
          sub: [
            {
              _id: 4,
              title: 'Identification of needs',
              number: '2.1'
            },
            {
              _id: 5,
              title: 'Verification of ID',
              number: '2.2',
              sub: [
                {
                  _id: 6,
                  title: 'Inquiry handling',
                  number: '2.2.1',
                  sub: [
                    {
                      _id: 7,
                      title: 'Due diligence',
                      number: '2.2.1.1'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
    }
  }
});
