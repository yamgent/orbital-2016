class Tutorial < ActiveRecord::Base
  belongs_to :course

  has_many :user_tutorial_selections
  has_many :users, through: :user_tutorial_selections
end
