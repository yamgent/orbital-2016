class UserTutorialSelection < ActiveRecord::Base
  belongs_to :user
  belongs_to :tutorial
end
